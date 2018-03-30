import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getActivity } from "../../../../activities/store/selectors"
import { ActionView } from '../../../../contacts/page/panels/record/components'
import { Link } from "react-router-dom"
import { Money } from 'react-format'
import * as MDIcons from 'react-icons/lib/md'
import {deleteActivity, saveActivity} from "../../../../activities/service"
import _ from 'lodash'


class Record extends React.Component {
  constructor(props) {
    super(props)

    this._submit = this._submit.bind(this)
    this._complete = this._complete.bind(this)
    this._delete = this._delete.bind(this)

    this.state = {
      formState: props.activity.originalProps
    }
  }

  _complete() {
    const { formState } = this.state

    _.set(formState, 'completed', 1)

    this._submit(formState)
  }

  _submit(state) {
    const submitData = state.id ? state : this.state.formState

    this.props.dispatch(saveActivity(submitData))
  }

  _delete() {
    this.props.dispatch(deleteActivity(this.props.activity.id))
  }

  render() {
    const { activity } = this.props
    const actionView = activity.details_type === 'App\\CallActivity' ? 'call' : 'email'

    if (activity.id === null && this.props.match.params.id !== 'new') {
      return (
        <main className="col main-panel px-3 align-self-center">
          <h2 className="text-muted text-center">Select a task on the left to get started.</h2>
        </main>
      )
    }

    return (
      <main className="col main-panel px-3">
        <div className="toolbar border-bottom py-2 heading list-inline">
          <button className="btn btn-primary mr-3 btn-sm list-inline-item" onClick={this._complete}><span className="h5"><MDIcons.MdCheck /></span></button>
          <button className="btn btn-link mr-2 btn-sm list-inline-item" onClick={this._delete}><span className="h2"><MDIcons.MdDelete /></span></button>

          <div className="float-right text-right pt-2">
            <div className="mini-text text-muted">Assigned To</div>
            <div className="text-dark mini-text"><b>{activity.user.name}</b></div>
          </div>

        </div>

        <h4 className="border-bottom py-3">
          {activity.name}
        </h4>

        <div className="h-scroll">
          <div className="card mb-2">
            <div className="card-body border-bottom" dangerouslySetInnerHTML={{__html: activity.description}} />
            <ActionView view={actionView} contact={activity.contact} user={activity.user} />
          </div>
          <div className="row">
            {activity.contact ?
              <div className="col-12">
                <div className="card mb-1">
                  <ul className="list-group list-group-flush">
                    <li key="company" className="list-group-item">
                      <div className="mini-text text-muted">Contact Information</div>
                      <div className="py-2">
                        <p className="font-weight-bold"><Link className="hidden-link" to={`/contacts/${activity.contact.id}`}>{activity.contact.first_name} {activity.contact.last_name}</Link></p>
                        <p className=""><Link className="hidden-link" to={`/companies/${activity.contact.company.id}`}>{activity.contact.company.name}</Link></p>
                        <p className="text-muted">{activity.contact.address1} {activity.contact.city} {activity.contact.state} {activity.contact.zip}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              : ''}
            <div className="col-12">
              <div className="card mb-1">
                <ul className="list-group list-group-flush">
                  <li key="company" className="list-group-item">
                    <div className="mini-text text-muted">Company Information</div>
                    <div className="py-2">
                      <p className="font-weight-bold"><Link className="hidden-link" to={`/companies/${activity.company.id}`}>{activity.company.name}</Link></p>
                      <p className="text-muted">{activity.company.address1} {activity.company.city} {activity.company.state} {activity.company.zip}</p>
                      <p>{activity.company.phone}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="card mb-1">
                <ul className="list-group list-group-flush">
                  <li key="company" className="list-group-item">
                    <div className="mini-text text-muted">Opportunity Information</div>
                    <div className="py-2">
                      <p className="font-weight-bold"><Link className="hidden-link" to={`/opportunities/${activity.opportunity.id}`}>{activity.opportunity.name}</Link></p>
                      <p className=""><Money>{activity.opportunity.amount}</Money></p>
                      <p className="">{activity.opportunity.estimated_close}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

Record.propTypes = {
  activity: PropTypes.object.isRequired
}

export default withRouter(connect((state, ownProps) => ({
  activity: getActivity(state, ownProps.match.params.id || {})
}))(Record))