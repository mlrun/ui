// todo: metrics - remove when use real APi
export const getMetrics = () => [
  {
    app: 'mlrun-infra',
    name: 'invocations-rate',
    type: 'metric',
    project: 'infer-model-tsdb-t3',
    full_name: 'infer-model-tsdb-t3.mlrun-infra.metric.invocations-rate'
  },
  {
    app: 'histogram-data-drift',
    name: 'hellinger_mean',
    type: 'metric',
    project: 'infer-model-tsdb-t3',
    full_name: 'infer-model-tsdb-t3.histogram-data-drift.metric.hellinger_mean'
  },
  {
    app: 'histogram-data-drift',
    name: 'kld_mean',
    type: 'metric',
    project: 'infer-model-tsdb-t3',
    full_name: 'infer-model-tsdb-t3.histogram-data-drift.metric.kld_mean'
  },
  {
    app: 'histogram-data-drift',
    name: 'tvd_mean',
    type: 'metric',
    project: 'infer-model-tsdb-t3',
    full_name: 'infer-model-tsdb-t3.histogram-data-drift.metric.tvd_mean'
  },
  {
    app: 'histogram-data-drift',
    name: 'general_drift',
    type: 'result',
    project: 'infer-model-tsdb-t3',
    full_name: 'infer-model-tsdb-t3.histogram-data-drift.result.general_drift'
  }
]

export const getMetricsValues = () => [
  {
    full_name: 'infer-model-tsdb-t3.mlrun-infra.metric.invocations-rate',
    type: 'metric',
    data: true,
    values: [
      ['2021-09-01T00:00:00+00:00', 500000],
      ['2021-09-01T00:05:00+00:00', 600000],
      ['2021-09-01T00:10:00+00:00', 700000],
      ['2021-09-01T00:15:00+00:00', 800000],
      ['2021-09-01T00:20:00+00:00', 900000],
      ['2021-09-01T00:25:00+00:00', 950000],
      ['2021-09-01T00:30:00+00:00', 980000],
      ['2021-09-01T00:35:00+00:00', 990000],
      ['2021-09-01T00:40:00+00:00', 950000],
      ['2021-09-01T00:45:00+00:00', 900000],
      ['2021-09-01T00:50:00+00:00', 850000],
      ['2021-09-01T00:55:00+00:00', 800000],
      ['2021-09-01T01:00:00+00:00', 750000],
      ['2021-09-01T01:05:00+00:00', 700000],
      ['2021-09-01T01:10:00+00:00', 650000],
      ['2021-09-01T01:15:00+00:00', 600000],
      ['2021-09-01T01:20:00+00:00', 550000],
      ['2021-09-01T01:25:00+00:00', 500000],
      ['2021-09-01T01:30:00+00:00', 450000],
      ['2021-09-01T01:35:00+00:00', 400000],
      ['2021-09-01T01:40:00+00:00', 350000],
      ['2021-09-01T01:45:00+00:00', 300000],
      ['2021-09-01T01:50:00+00:00', 250000],
      ['2021-09-01T01:55:00+00:00', 200000],
      ['2021-09-01T02:00:00+00:00', 150000],
      ['2021-09-01T02:05:00+00:00', 100000],
      ['2021-09-01T02:10:00+00:00', 50000],
      ['2021-09-01T02:15:00+00:00', 0],
      ['2021-09-01T02:20:00+00:00', 50000],
      ['2021-09-01T02:25:00+00:00', 100000],
      ['2021-09-01T02:30:00+00:00', 150000],
      ['2021-09-01T02:35:00+00:00', 200000],
      ['2021-09-01T02:40:00+00:00', 250000],
      ['2021-09-01T02:45:00+00:00', 300000],
      ['2021-09-01T02:50:00+00:00', 350000],
      ['2021-09-01T02:55:00+00:00', 400000],
      ['2021-09-01T03:00:00+00:00', 450000],
      ['2021-09-01T03:05:00+00:00', 500000],
      ['2021-09-01T03:10:00+00:00', 550000],
      ['2021-09-01T03:15:00+00:00', 600000],
      ['2021-09-01T03:20:00+00:00', 650000],
      ['2021-09-01T03:25:00+00:00', 700000],
      ['2021-09-01T03:30:00+00:00', 750000],
      ['2021-09-01T03:35:00+00:00', 800000],
      ['2021-09-01T03:40:00+00:00', 850000],
      ['2021-09-01T03:45:00+00:00', 900000],
      ['2021-09-01T03:50:00+00:00', 950000],
      ['2021-09-01T03:55:00+00:00', 1000000],
      ['2021-09-01T04:00:00+00:00', 1050000],
      ['2021-09-01T04:05:00+00:00', 1100000],
      ['2021-09-01T04:10:00+00:00', 1150000],
      ['2021-09-01T04:15:00+00:00', 1200000],
      ['2021-09-01T04:20:00+00:00', 1250000],
      ['2021-09-01T04:25:00+00:00', 1300000],
      ['2021-09-01T04:30:00+00:00', 1350000],
      ['2021-09-01T04:35:00+00:00', 1400000],
      ['2021-09-01T04:40:00+00:00', 1450000],
      ['2021-09-01T04:45:00+00:00', 1500000],
      ['2021-09-01T04:50:00+00:00', 1550000],
      ['2021-09-01T04:55:00+00:00', 1600000],
      ['2021-09-01T05:00:00+00:00', 1650000]
    ]
  },
  {
    full_name: 'infer-model-tsdb-t3.histogram-data-drift.metric.hellinger_mean',
    type: 'metric',
    data: true,
    values: [
      ['2021-09-01T00:00:00+00:00', 0.5],
      ['2021-09-01T00:20:00+00:00', 0.6],
      ['2021-09-01T00:40:00+00:00', 0.7],
      ['2021-09-01T01:00:00+00:00', 0.8],
      ['2021-09-01T01:20:00+00:00', 0.9],
      ['2021-09-01T01:40:00+00:00', 0.95],
      ['2021-09-01T02:00:00+00:00', 0.98],
      ['2021-09-01T02:20:00+00:00', 0.99],
      ['2021-09-01T02:40:00+00:00', 0.95],
      ['2021-09-01T03:00:00+00:00', 0.9],
      ['2021-09-01T03:20:00+00:00', 0.85],
      ['2021-09-01T03:40:00+00:00', 0.8],
      ['2021-09-01T04:00:00+00:00', 0.75],
      ['2021-09-01T04:20:00+00:00', 0.7],
      ['2021-09-01T04:40:00+00:00', 0.65],
      ['2021-09-01T05:00:00+00:00', 0.6]
    ]
  },
  {
    full_name: 'infer-model-tsdb-t3.histogram-data-drift.result.general_drift',
    type: 'result',
    result_kind: 'data_drift',
    data: true,
    values: [
      ['2021-09-01T00:00:00+00:00', 0.5, 0],
      ['2021-09-01T00:10:00+00:00', 0.6, 1],
      ['2021-09-01T00:20:00+00:00', 0.7, 2],
      ['2021-09-01T00:30:00+00:00', 0.8, 0],
      ['2021-09-01T00:40:00+00:00', 0.9, 0],
      ['2021-09-01T00:50:00+00:00', 0.95, 0],
      ['2021-09-01T01:00:00+00:00', 0.98, 0],
      ['2021-09-01T01:10:00+00:00', 0.99, 0],
      ['2021-09-01T01:20:00+00:00', 0.95, 0],
      ['2021-09-01T01:30:00+00:00', 0.9, 0],
      ['2021-09-01T01:40:00+00:00', 0.85, 0],
      ['2021-09-01T01:50:00+00:00', 0.8, 0],
      ['2021-09-01T02:00:00+00:00', 0.75, 0],
      ['2021-09-01T02:10:00+00:00', 0.7, 0],
      ['2021-09-01T02:20:00+00:00', 0.65, 0],
      ['2021-09-01T02:30:00+00:00', 0.6, 0],
      ['2021-09-01T02:40:00+00:00', 0.55, 0],
      ['2021-09-01T02:50:00+00:00', 0.5, 0],
      ['2021-09-01T03:00:00+00:00', 0.45, 0],
      ['2021-09-01T03:10:00+00:00', 0.4, 0],
      ['2021-09-01T03:20:00+00:00', 0.35, 0],
      ['2021-09-01T03:30:00+00:00', 0.3, 0],
      ['2021-09-01T03:40:00+00:00', 0.25, 0],
      ['2021-09-01T03:50:00+00:00', 0.2, 0],
      ['2021-09-01T04:00:00+00:00', 0.15, 0],
      ['2021-09-01T04:10:00+00:00', 0.1, 0],
      ['2021-09-01T04:20:00+00:00', 0.05, 0],
      ['2021-09-01T04:30:00+00:00', 0.0, 1],
      ['2021-09-01T04:40:00+00:00', 0.05, 1],
      ['2021-09-01T04:50:00+00:00', 0.1, 1],
      ['2021-09-01T05:00:00+00:00', 0.15, 1]
    ]
  },
  {
    full_name: 'infer-model-tsdb-t3.relatively-new-app.result.res1',
    type: 'result',
    data: false
  }
]
