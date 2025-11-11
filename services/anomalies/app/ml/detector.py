"""
ML Ensemble Anomaly Detector
Combines Prophet (time-series), IsolationForest (outliers), and LSTM (patterns)
"""

import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import structlog
from typing import List, Tuple
import warnings

warnings.filterwarnings('ignore')

logger = structlog.get_logger()


class AnomalyDetector:
    """
    Multi-algorithm ensemble for anomaly detection.

    Algorithms:
    1. Prophet: Detects seasonal/trend anomalies
    2. IsolationForest: Detects statistical outliers
    3. LSTM: Detects pattern anomalies (future enhancement)

    Voting: Anomaly if 2/3 algorithms agree
    """

    def __init__(
        self,
        prophet_interval_width: float = 0.99,
        isolation_contamination: float = 0.05,
        min_data_points: int = 30,
    ):
        self.prophet_interval_width = prophet_interval_width
        self.isolation_contamination = isolation_contamination
        self.min_data_points = min_data_points
        self.scaler = StandardScaler()

    def detect(
        self,
        timestamps: List[str],
        values: List[float],
        metric_name: str,
    ) -> dict:
        """
        Run ensemble detection and return anomalies.

        Args:
            timestamps: List of ISO timestamp strings
            values: List of metric values
            metric_name: Name of the metric

        Returns:
            {
                "anomalies": [{"timestamp": "...", "value": ..., "score": ...}],
                "summary": {"total_points": ..., "anomaly_count": ..., "severity": ...},
                "algorithms": {"prophet": [...], "isolation_forest": [...]}
            }
        """

        if len(timestamps) < self.min_data_points:
            logger.warning(
                "Insufficient data for detection",
                metric=metric_name,
                points=len(timestamps),
                required=self.min_data_points,
            )
            return {
                "anomalies": [],
                "summary": {
                    "total_points": len(timestamps),
                    "anomaly_count": 0,
                    "severity": "none",
                    "error": f"Minimum {self.min_data_points} data points required",
                },
            }

        try:
            # Prepare data
            df = pd.DataFrame({
                "ds": pd.to_datetime(timestamps),
                "y": values,
            })

            # Run algorithms
            prophet_anomalies = self._detect_prophet(df)
            isolation_anomalies = self._detect_isolation_forest(df)

            # Ensemble voting (2/3 agreement)
            anomalies = self._ensemble_vote(
                df,
                prophet_anomalies,
                isolation_anomalies,
            )

            # Calculate severity
            severity = self._calculate_severity(anomalies, len(timestamps))

            logger.info(
                "Anomaly detection complete",
                metric=metric_name,
                total_points=len(timestamps),
                anomalies=len(anomalies),
                severity=severity,
            )

            return {
                "anomalies": anomalies,
                "summary": {
                    "total_points": len(timestamps),
                    "anomaly_count": len(anomalies),
                    "severity": severity,
                    "prophet_detections": len(prophet_anomalies),
                    "isolation_detections": len(isolation_anomalies),
                },
                "algorithms": {
                    "prophet": prophet_anomalies,
                    "isolation_forest": isolation_anomalies,
                },
            }

        except Exception as e:
            logger.error("Anomaly detection failed", exc_info=e, metric=metric_name)
            raise

    def _detect_prophet(self, df: pd.DataFrame) -> List[int]:
        """Detect anomalies using Prophet (seasonal + trend)"""

        try:
            # Configure Prophet
            model = Prophet(
                interval_width=self.prophet_interval_width,
                daily_seasonality=True,
                weekly_seasonality=True,
                yearly_seasonality=False,  # Need more data
                changepoint_prior_scale=0.05,
            )

            # Fit model
            model.fit(df)

            # Predict with uncertainty intervals
            forecast = model.predict(df)

            # Identify anomalies (values outside prediction intervals)
            anomalies = []
            for i, row in df.iterrows():
                pred = forecast.iloc[i]
                actual = row["y"]

                if actual < pred["yhat_lower"] or actual > pred["yhat_upper"]:
                    anomalies.append(i)

            logger.debug(
                "Prophet detection complete",
                anomalies=len(anomalies),
            )

            return anomalies

        except Exception as e:
            logger.error("Prophet detection failed", exc_info=e)
            return []

    def _detect_isolation_forest(self, df: pd.DataFrame) -> List[int]:
        """Detect anomalies using IsolationForest (statistical outliers)"""

        try:
            # Prepare features
            # - Value itself
            # - Hour of day (cyclical)
            # - Day of week (cyclical)
            # - Rolling mean/std
            df["hour"] = df["ds"].dt.hour
            df["dayofweek"] = df["ds"].dt.dayofweek
            df["rolling_mean"] = df["y"].rolling(window=7, min_periods=1).mean()
            df["rolling_std"] = df["y"].rolling(window=7, min_periods=1).std().fillna(0)

            features = df[["y", "hour", "dayofweek", "rolling_mean", "rolling_std"]].values

            # Normalize
            features_scaled = self.scaler.fit_transform(features)

            # Train IsolationForest
            model = IsolationForest(
                contamination=self.isolation_contamination,
                random_state=42,
                n_estimators=100,
            )

            predictions = model.fit_predict(features_scaled)

            # -1 = anomaly, 1 = normal
            anomalies = [i for i, pred in enumerate(predictions) if pred == -1]

            logger.debug(
                "IsolationForest detection complete",
                anomalies=len(anomalies),
            )

            return anomalies

        except Exception as e:
            logger.error("IsolationForest detection failed", exc_info=e)
            return []

    def _ensemble_vote(
        self,
        df: pd.DataFrame,
        prophet_anomalies: List[int],
        isolation_anomalies: List[int],
    ) -> List[dict]:
        """Ensemble voting: anomaly if 2/3 algorithms agree"""

        # For now, using 2/2 (Prophet + IsolationForest)
        # TODO: Add LSTM as third algorithm

        prophet_set = set(prophet_anomalies)
        isolation_set = set(isolation_anomalies)

        # Intersection (both agree)
        confirmed_anomalies = prophet_set & isolation_set

        anomalies = []
        for idx in confirmed_anomalies:
            row = df.iloc[idx]

            # Calculate anomaly score (0-1)
            # Based on how many algorithms flagged it
            score = 1.0  # Both agreed

            anomalies.append({
                "timestamp": row["ds"].isoformat(),
                "value": float(row["y"]),
                "score": score,
                "index": int(idx),
            })

        # Sort by timestamp
        anomalies.sort(key=lambda x: x["timestamp"])

        return anomalies

    def _calculate_severity(self, anomalies: List[dict], total_points: int) -> str:
        """Calculate severity based on anomaly rate"""

        if not anomalies:
            return "none"

        anomaly_rate = len(anomalies) / total_points

        if anomaly_rate >= 0.10:  # 10%+ anomalies
            return "critical"
        elif anomaly_rate >= 0.05:  # 5-10%
            return "warning"
        elif anomaly_rate >= 0.02:  # 2-5%
            return "info"
        else:
            return "low"
