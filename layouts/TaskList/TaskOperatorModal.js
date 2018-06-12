import React, { Component } from 'react'
import { Modal, Button, Row, Col, Icon } from 'antd'

export default class TaskOperatorModal extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { visible, handleCancel, handleOk, currentJob } = this.props
    const parseTime = (str) => {
      if (!str || isNaN(str)) {
        return '---'
      }

      return (new Date(Number(str))).toLocaleString()
    }

    return (
      <Modal
        title={currentJob['name']}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>取消</Button>,
          <Button key="submit" type="primary" icon="rocket" onClick={handleOk}>执行</Button>,
          <Button key="reload" type="primary" icon="scan">重新加载</Button>
        ]}
      >
        <div className="task-modal">
          <div className="title">
            <span className="title-icon"><Icon type="dashboard" /></span>
            <span>任务id：{currentJob['id']}</span>
          </div>
          <div className="content">
            <Row>
              <Col span="12">
                <div className="term">间隔：</div>
                <div className="detail">{currentJob['intervalHuman']}</div>
              </Col>
              <Col span="12">
                <div className="term">上次执行：</div>
                <div className="detail">{parseTime(currentJob['lastRunAt'])}</div>
              </Col>
              <Col span="12">
                <div className="term">状态：</div>
                <div className="detail">{currentJob['state']}</div>
              </Col>
              <Col span="12">
                <div className="term">下次执行：</div>
                <div className="detail">{parseTime(currentJob['nextRunAt'])}</div>
              </Col>
            </Row>
            <div className="description">{currentJob.description}</div>
          </div>
        </div>
      </Modal>
    )
  }
}