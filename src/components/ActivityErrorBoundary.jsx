import React from 'react'

export default class ActivityErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, resetKey: 0 }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('Activity failed', { error, info, activityId: this.props.activityId })
  }

  reset = () => this.setState(state => ({ error: null, resetKey: state.resetKey + 1 }))

  render() {
    if (this.state.error) {
      return <section className="activity-error" role="alert">
        <h2>Hoạt động tạm thời chưa chạy được</h2>
        <p>Tiến trình của phần còn lại vẫn an toàn. Em hãy thử mở lại hoạt động.</p>
        <button id={`retry-activity-${this.props.activityId}`} onClick={this.reset}>Thử lại</button>
      </section>
    }
    return <React.Fragment key={this.state.resetKey}>{this.props.children}</React.Fragment>
  }
}

