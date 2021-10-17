import React, {useState, useEffect} from 'react'
import './App.css';
import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles'
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField} from '@material-ui/core';
import {Edit, Delete} from '@material-ui/icons';

const url = "https://jsonplaceholder.typicode.com/users/";
 
const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {
  const style = useStyles();
  const[data,setData] = useState([]);
  const[modalInsert, setModalInsert] = useState(false);
  const[modalUpdate, setModalUpdate] = useState(false);
  const[modalDelete, setModalDelete] = useState(false);

  const[selectedData, setSelectedData] = useState({
    name:"",
    email:"",
    website:"",
    phone:""
  })

  const handleChange = e => {
    const{name,value}=e.target;
    setSelectedData(prevState=>({
      ...prevState,
      [name]:value
    }))
    console.log(selectedData);
  }

  const openCloseModalInsert = () =>{
    setModalInsert(!modalInsert);
  }

  const openCloseModalUpdate = () =>{
    setModalUpdate(!modalUpdate);
  }

  const openCloseModalDelete = () =>{
    setModalDelete(!modalDelete);
  }

  const selectData = (user, actual) => {
    setSelectedData(user);
    (actual === 'Update') ? openCloseModalUpdate() : openCloseModalDelete()
  }

  const requestGet = async () => {
    await axios.get(url)
    .then(response =>{
      setData(response.data);
    })
  }

  useEffect(async() => {
    await requestGet();
  },[])

  const requestPost = async () => {
    await axios.post(url, selectedData)
    .then( response =>{
      setData(data.concat(response.data))
      openCloseModalInsert()
    })
  }

  const requestPut = async () => {
    await axios.put(url+selectedData.id, selectedData)
    .then(response => {
      var newData = data;
      newData .map(user => {
        if(selectedData.id===user.id){
          user.name = selectedData.name;
          user.email = selectedData.email;
          user.website = selectedData.website;
          user.phone = selectedData.phone;
        }
      })
      setData(newData);
      openCloseModalUpdate();
    })
  }

  const requestDelete = async () => {
    await axios.delete(url+selectedData.id)
    .then(response => {
      setData(data.filter(user=>user.id!==selectedData.id))
    })
    openCloseModalDelete();
  }

  const insertBody = (
    <div className={style.modal}>
      <h3>Insertar Nuevo Usuario</h3>
      <TextField name="name" className={style.inputMaterial} label="Nombre" onChange={handleChange}/>
      <br/>
      <TextField name="email" className={style.inputMaterial} label="E-Mail" onChange={handleChange}/>
      <br/>
      <TextField name="website" className={style.inputMaterial} label="Website" onChange={handleChange}/>
      <br/>
      <TextField name="phone" className={style.inputMaterial} label="Telefono" onChange={handleChange}/>
      <br/><br/>
      <div align="right">
        <Button color="primary" onClick={() => requestPost()}>Insertar</Button>
        <Button onClick={() => openCloseModalInsert()}>Cancelar</Button>
      </div>
    </div>
  )

  const updateBody = (
    <div className={style.modal}>
      <h3>Actualizar Usuario</h3>
      <TextField name="name" className={style.inputMaterial} label="Nombre" onChange={handleChange} value={selectedData && selectedData.name}/>
      <br/>
      <TextField name="email" className={style.inputMaterial} label="E-Mail" onChange={handleChange} value={selectedData && selectedData.email}/>
      <br/>
      <TextField name="website" className={style.inputMaterial} label="Website" onChange={handleChange} value={selectedData && selectedData.website}/>
      <br/>
      <TextField name="phone" className={style.inputMaterial} label="Telefono" onChange={handleChange} value={selectedData && selectedData.phone}/>
      <br/><br/>
      <div align="right">
        <Button color="primary" onClick={() => requestPut()}>Actualizar</Button>
        <Button onClick={() => openCloseModalUpdate()}>Cancelar</Button>
      </div>
    </div>
  )

  const deleteBody = (
    <div className={style.modal}>
      <h3>Eliminar <b>{selectedData && selectedData.nombre}</b> </h3>
      <p>Estas seguro que deseas continuar?</p>
      <div align="right">
        <Button color="secondary" onClick={() => requestDelete()}>Si</Button>
        <Button onClick={() => openCloseModalDelete()}>No</Button>
      </div>
    </div>
  )

  return (
    <>
      <br/>
      <Button onClick={() => openCloseModalInsert()}>Insertar</Button>
      <br></br>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre: </TableCell>
              <TableCell>E-Mail: </TableCell>
              <TableCell>Website: </TableCell>
              <TableCell>Telefono: </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map(user => (
              <TableRow key = {user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.website}</TableCell>
                <TableCell>{user.phone}</TableCell>
                
                <TableCell>
                  <Edit className={style.iconos} onClick={() => selectData(user,'Update')}/>
                  &nbsp;&nbsp;
                  <Delete className={style.iconos} onClick={() => selectData(user,'Delete')}/>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalInsert}
        onClose={openCloseModalInsert}
      >
        {insertBody}
      </Modal>

      <Modal
        open={modalUpdate}
        onClose={openCloseModalUpdate}
      >
        {updateBody}
      </Modal>

      <Modal
        open={modalDelete}
        onClose={openCloseModalDelete}
      >
        {deleteBody}
      </Modal>
    </>
  );
}

export default App;
