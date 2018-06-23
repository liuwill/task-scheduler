import React, { Component } from 'react' // eslint-disable-line
import Breadcrumb from '../../components/Breadcrumb'
import TaskOperatorModal from './TaskOperatorModal'
import { List, notification, Icon, Button } from 'antd'

export default class TaskList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      currentJob: {},
      currentJobId: '',
    }
  }

  handleClickOperation = (jobId) => {
    console.log(jobId)
    this.setState((prevState, props) => ({
      currentJobId: jobId,
      currentJob: props.listData[jobId] || {},
      visible: true,
    }))
  }

  handleOk = (e) => {
    notification.open({
      message: '任务提交成功',
      description: '任务提交成功，详细情况请查看日志',
      icon: <Icon type="exclamation-circle-o" style={{ color: '#108ee9' }} />,
    })

    this.setState({
      visible: false,
    })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const parseTime = (str) => {
      if (!str || isNaN(str)) {
        return '---'
      }

      return (new Date(Number(str))).toLocaleString()
    }

    const { listData } = this.props
    const taskListData = Object.values(listData)

    const pagination = {
      pageSize: 10,
      current: 1,
      total: taskListData.length,
      onChange: () => { },
    }

    return (
      <div className="task-list-panel">
        <Breadcrumb icon="clock-circle-o" title="定时任务" />
        {/* <div className="page-wrapper">
          <div className="page-wrapper-body">
            <Row>
              <Col span={8}>col-8</Col>
              <Col span={8}>col-8</Col>
              <Col span={8}>col-8</Col>
            </Row>
          </div>
        </div> */}

        <div className="page-card">
          <div className="card-header">
            <div className="card-header-title">定时任务列表</div>
          </div>
          <div className="list-page">
            <List
              itemLayout="horizontal"
              size="large"
              pagination={pagination}
              dataSource={taskListData}
              renderItem={item => (
                <List.Item
                  key={item.title}
                  actions={[
                    <Button type="primary" size="small">日志</Button>,
                    <Button size="small"
                      onClick={ () => { this.handleClickOperation(item.id) }}
                    >操作</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="item-logo">T</div>
                    }
                    title={<a href={item.href}>{item.id}</a>}
                    description={item.name}
                  />
                  <div>
                    <div>上次执行：{parseTime(item.lastRunAt)}</div>
                    <div>下次执行：{parseTime(item.nextRunAt)}</div>
                    <div>执行间隔：{item.intervalHuman}</div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>

        <TaskOperatorModal
          currentJob={this.state.currentJob}
          visible={this.state.visible}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
        />
      </div>
    )
  }
}
