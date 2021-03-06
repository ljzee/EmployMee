import React from 'react';

import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {Col, Row, Card, Button, DropdownButton, Dropdown, Badge, Spinner, Modal, Alert} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import JobPost from './JobPost';
import {userService, fileService} from '@/_services';
import Select from 'react-select';
import {JobPostType} from '@/_helpers';

import './JobPost.css'

class UserJobPostPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      jobTitle: '',
      companyName: '',
      companyPhoneNumber: '',
      companyWebsite: '',
      resumeRequired: false,
      coverletterRequired: false,
      otherRequired: false,
      datePublished: '',
      deadline: '',
      description: '',
      duration: '',
      openings: 0,
      positionType: '',
      salary: '',
      status: '',
      jobAddress: '',
      businessId : '',
      applied: false,
      showApplicationModal: false,
      fields: []
    }

    this.fetchJobPost = this.fetchJobPost.bind(this);
    this.getActionButton = this.getActionButton.bind(this);
    this.getStatusBadge = this.getStatusBadge.bind(this);
    this.toggleShowApplyModal = this.toggleShowApplyModal.bind(this);
    this.generateFields = this.generateFields.bind(this);
  }

  componentDidMount(){
    this.fetchJobPost();
  }

  toggleShowApplyModal(){
    this.setState((prevState)=>{
      return {
        showApplicationModal: !prevState.showApplicationModal
      }
    })
  }

  getStatusBadge(){
    let statusBadge;
    if(this.state.status === 'OPEN'){
      statusBadge = <Badge style={{fontSize: "15px"}} variant="success">Active</Badge>
    }else if(this.state.status === 'DRAFT'){
      statusBadge = <Badge style={{fontSize: "15px"}} variant="warning">Draft</Badge>
    }else{
      statusBadge = <Badge style={{fontSize: "15px"}} variant="danger">Closed</Badge>
    }
    return statusBadge
  }

  getActionButton(){

    let actionButton;
    if(this.state.applied){
      actionButton = <Button variant="success" className="float-right" disabled>Applied</Button>
    }else if(this.state.status === JobPostType.Closed){
      actionButton = <DropdownButton id="dropdown-basic-button" title="Actions" className="float-right" disabled/>
    }else{
      actionButton = <DropdownButton id="dropdown-basic-button" title="Actions" className="float-right">
                      <Dropdown.Item onClick={()=>{this.toggleShowApplyModal()}}>Apply</Dropdown.Item>
                      <Dropdown.Item>Bookmark Job</Dropdown.Item>
                     </DropdownButton>
    }
    return actionButton;

  }

  fetchJobPost() {

    Promise.all([userService.getJobPost(this.props.location.state.id), fileService.getAllUserFiles()])
           .then(result => {
             let generatedFields = this.generateFields(result[0].resume_required, result[0].coverletter_required, result[0].other_required, result[1])
             this.setState({
               loading: false,
               jobTitle: result[0].title,
               companyName: result[0].company_name,
               companyPhoneNumber: result[0].phone_number,
               companyWebsite: result[0].website,
               resumeRequired: result[0].resume_required,
               coverletterRequired: result[0].coverletter_required,
               otherRequired: result[0].other_required,
               datePublished: result[0].date_published,
               deadline: result[0].deadline,
               description: result[0].description,
               duration: result[0].duration,
               openings: result[0].openings,
               positionType: result[0].position_type,
               salary: result[0].salary,
               status: result[0].status,
               applied: result[0].applied,
               jobAddress: result[0].addresses.find(post => (post.id === result[0].a_id)),
               businessId: result[0].b_id,
               showApplicationModal: false,
               fields: generatedFields
             })
           })
    //Promise.all() fileService.getAllUserFiles() + userService.getJobPost

  }

  generateFields(resumeRequired, coverletterRequired, otherRequired, files){
      let resumeOptions = files.filter(file => (file.file_type === 'Resume')).map(file => ({label: file.file_name, value: file.file_id}))
      let coverletterOptions = files.filter(file => (file.file_type === 'Cover Letter')).map(file => ({label: file.file_name, value: file.file_id}))
      let otherOptions = files.filter(file => (file.file_type === 'Others')).map(file => ({label: file.file_name, value: file.file_id}))

      let fields = []

      fields.push({label: 'Resume', name: 'resume', value:'', options: resumeOptions, required: resumeRequired})
      fields.push({label: 'Cover Letter', name: 'coverLetter', value: '', options: coverletterOptions, required: coverletterRequired})
      fields.push({label: 'Other', name:'other', value:'', options: otherOptions, required: otherRequired})

      return fields;

  }



  render(){

    const initialValues = {};
    this.state.fields.forEach(field => {
      if(!initialValues[field.name]){
        initialValues[field.name] = field.value;
      }
    })
    const validationObject = {};
    this.state.fields.forEach(field=>{
      if(!validationObject[field.name]){
        if(field.required){
          validationObject[field.name] = Yup.string().required(`${field.label} is required`);
        }else{
          validationObject[field.name] = Yup.string()
        }
      }
    })
    const validation = Yup.object().shape(validationObject)

    if(this.state.loading) return(

      <div className="profile-page mx-auto">
        <Row>
          <Col md={{offset:3, span:9}} style={{marginBottom: 0}}>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </div>
    )

    const backButton = ()=>(<Link className="jobpostpage-backlink" to="/searchjobs">Back to job search</Link>)

    return(
      <React.Fragment>
        <JobPost
          getActionButton={this.getActionButton}
          getStatusBadge={this.getStatusBadge}
          jobTitle={this.state.jobTitle}
          status={this.state.status}
          companyName={this.state.companyName}
          jobAddress={this.state.jobAddress}
          resumeRequired={this.state.resumeRequired}
          coverletterRequired={this.state.coverletterRequired}
          otherRequired={this.state.otherRequired}
          deadline={this.state.deadline}
          description={this.state.description}
          positionType={this.state.positionType}
          duration={this.state.duration}
          openings={this.state.openings}
          salary={this.state.salary}
          companyWebsite={this.state.companyWebsite}
          companyPhoneNumber={this.state.companyPhoneNumber}
          datePublished={this.state.datePublished}
          businessId={this.state.businessId}
          location={this.props.location}
          backButton={backButton}
        />
        <Modal show={this.state.showApplicationModal} onHide={this.toggleShowApplyModal}>
          <Modal.Header closeButton>
            <Modal.Title>Select your documents</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              onSubmit={(values)=>{
                let documents = [];
                if(values.resume){
                  documents.push(values.resume);
                }
                if(values.coverLetter){
                  documents.push(values.coverLetter);
                }
                if(values.other){
                  documents.push(values.other);
                }
                userService.submitApplication(this.props.location.state.id, documents)
                           .then(()=>{this.fetchJobPost();})
                           .catch(error => console.log(error));
              }}
              initialValues={initialValues}
              validationSchema={validation}
              render={({
                values,
                touched,
                errors,
                dirty,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset,
                setFieldValue,
                setFieldTouched
              })=>(
                <Form>
                  <Alert style={{fontSize: "0.85rem", marginBottom: "30px"}} variant="primary">Once you submit your application, your documents and profile will be visible to the company.</Alert>
                  <div style={{marginBottom: "30px"}}>
                    {this.state.fields.map((field,index)=>(
                      <div className="form-options" key={index}>
                        <span className="application-modal-label">{`${field.label}:`}</span>
                        <Select className="filter-select modal-select" placeholder="Document" options={ field.options } onChange={(option)=>{
                          setFieldValue(field.name, option.value);
                        }} onBlur={()=>setFieldTouched(field.name, true)} />
                        {errors[field.name] && touched[field.name] && (

                          <div
                            style={{ color: "#dc3545", marginTop: ".25rem",  fontSize:"80%" }}
                          >
                            <span style={{display:"inline-block", width:"115px"}}>
                            </span>
                            <span style={{display:"inline-block", width: "200px", textAlign:"left"}}>
                            {errors[field.name]}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                  <Button className="application-modal-button float-right" variant="secondary" onClick={this.toggleShowApplyModal}>
                    Close
                  </Button>
                  <Button className="application-modal-button float-right" variant="primary" type="submit">
                    Apply
                  </Button>
                  <Link style={{fontSize: "0.85rem", display: 'inline', lineHeight: "33px"}}to="/documents">Need to upload some documents?</Link>
                  </div>
                </Form>
              )}
            />
          </Modal.Body>
        </Modal>
      </React.Fragment>
    )
  }
}

export {UserJobPostPage};
