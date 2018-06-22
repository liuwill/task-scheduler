import React, { Component } from 'react' // eslint-disable-line
import SidePanel from '../components/SidePanel'
// import SideMenu from '../components/SideMenu'
import NavHeader from '../components/NavHeader'
import Layout from '../components/Layout'
import TaskList from '../layouts/TaskList'
import axios from 'axios'

export default class Index extends Component {
  static geInitialProps({ req }) {
    const language = req ? req.headers['accept-language'] : navigator.language

    return {
      language
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      taskList: {}
    }
  }

  fetchTaskList = (e) => {
    return axios.get('/tasks', {
      params: {
        token: 12345
      }
    }).then((response) => {
      return response.data
    }).then((responseData) => {
      this.setState((prevState, props) => ({
        taskList: responseData.data || {},
      }))
      return responseData.data
    }).catch((error) => {
      console.log(error)
    })
  }

  componentDidMount() {
    this.fetchTaskList()
  }

  render() {
    return (
      <div className="app">
        <NavHeader />
        <div className="main">
          <SidePanel/>
          {/* <SideMenu/> */}
          <Layout>
            <TaskList listData={this.state.taskList}
              fetchTaskList={this.fetchTaskList}
            />
          </Layout>
        </div>
      </div>
    )
  }
}
