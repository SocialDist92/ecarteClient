import React, {Component} from 'react'
import {Table, Form, Button, Modal, Dropdown, FormControl, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faPlus, faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import AddToStudent from './addToStudent'
import axios from 'axios'

class ListCourses extends Component {
    constructor(props) {
        super()
        this.state = {
            show: false,
            showTwo: false,
            studentOnModal: undefined,
            filteredStudents: props.students ? [...props.students] : [],
            filterSearch: '',
            filterCourse: 'todos',
            debt: '',
            showSave: false
        }


    }


    deleteStudentRequest = (id) => {
        axios.post('https://obscure-wave-52978.herokuapp.com/api/delete-student?id=' + id).then(
            () => {
                this.props.deleteStudent(id)
            }
        ).catch(e => console.error(e))
    }

    handleClose = () => this.setState({show: false})
    handleCloseTwo = () => this.setState({showTwo: false})

    handleShow = (student) => {
        this.setState({
            studentOnModal: student,
            show: true,
            debt: student.debt
        })

    }

    handleShowTwo = (student) => {
        this.setState({
            showTwo: true
        })

    }

    handleFilter = () => {
        this.setState({
            filteredStudents: this.props.students.filter(student => {
                let pass = true
                const completeName = student.name.toLowerCase() + ' ' + student.lastName.toLowerCase()

                if (this.state.filterSearch.length && !completeName.includes(this.state.filterSearch)) {
                    pass = false
                }
                if (this.state.filterCourse !== 'todos' && !student.courses.includes(this.state.filterCourse)) {
                    pass = false
                }

                return pass
            })
        })

    }
    handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase()
        this.setState({filterSearch: searchTerm}, this.handleFilter)


    }

    handleCheck = (e) => {
        this.setState({filterCourse: e.target.value}, this.handleFilter)


    }

    componentDidUpdate(prevProps) {
        if (this.props.students.length !== prevProps.students.length) {
            this.setState({
                filteredStudents: [...this.props.students]
            })
        }
    }

    handleInput = (e) => {
        const value = e.target.value
        this.setState({
            debt: value
        }, () => {
            if (value === this.state.studentOnModal.debt) {
                this.setState({
                    showSave: false
                })
            } else {
                this.setState({
                    showSave: true
                })
            }
        })

    }


    render() {
        return (

            <section>

                <div className="d-flex justify-content-between">
                    <Form.Group>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                Filtro
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="px-2">
                                <Form.Group >
                                    <Form.Check onChange={this.handleCheck} name="radios"
                                                checked={this.state.filterCourse === 'todos'}
                                                value="todos" type="radio" label="todos"/>
                                </Form.Group>
                                {this.props.courses ? this.props.courses.map(course => <Form.Group key={course._id}>
                                        <Form.Check onChange={this.handleCheck} name="radios" type="radio"
                                                    value={course.name}
                                                    label={course.name}/>
                                    </Form.Group>) : null}


                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" onChange={this.handleSearch.bind(this)} placeholder="Buscar"/>
                    </Form.Group>
                </div>

                <Table striped bordered hover>
                    <thead>
                    <tr>

                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Opciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.filteredStudents ? this.state.filteredStudents.map(student => {
                                return (
                                    <tr key={student._id} style={{
                                        background: parseFloat(student.debt) > 0? 'darksalmon' : null
                                    }}>

                                        <td>{student.name}</td>
                                        <td>{student.lastName}</td>
                                        <td>
                                            <Button className="mr-2"
                                                    onClick={() => this.handleShowTwo()}><FontAwesomeIcon
                                                icon={faPlus}/></Button>
                                            <Button variant="secondary" onClick={() => this.handleShow(student)}
                                                    className="mr-2"><FontAwesomeIcon
                                                icon={faInfoCircle}/></Button>
                                            <Button onClick={() => this.deleteStudentRequest(student._id)}
                                                    variant="danger"><FontAwesomeIcon
                                                icon={faTrash}/></Button>


                                        </td>
                                    </tr>
                                )
                            }) : null
                    }
                    </tbody>
                </Table>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Info</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Cursos:
                        <ul>
                            {this.state.studentOnModal ? this.state.studentOnModal.courses.map((course, i) => <li
                                    key={i}>{course}</li>) :
                                <li>Ninguno</li>}
                        </ul>
                        {this.state.studentOnModal && this.state.studentOnModal.debt && parseFloat(this.state.studentOnModal.debt) > 0 ?
                            <Form.Group>
                                <Form.Label>Debe:</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>$</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl type="number" value={this.state.debt}
                                                 onChange={this.handleInput}
                                                 aria-label="Amount (to the nearest dollar)"/>
                                </InputGroup>
                                {this.state.showSave ? <Button>Guardar</Button> : null}
                            </Form.Group>
                            : null}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showTwo} onHide={this.handleCloseTwo}>
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>


            </section>
        )

    }
}

export default ListCourses;