import React from 'react';
import {post} from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';

const styles = theme =>({
   hidden:{
      display: 'none'
   }
});

class CustomerAdd extends React.Component{
   constructor(props){
      super(props);
      this.state = {
         file:null,
         userName: '',
         birthday: '',
         gender: '',
         job: '',
         fileName: '',
         open:false
      }
   }

   handleFormSubmit = (e) =>{
      e.preventDefault();
      
      this.addCustomer()
         .then((response) =>{
            this.props.stateRefresh();
         })
         
      this.setState({
         file:null,
         userName: '',
         birthday: '',
         gender: '',
         job: '',
         fileName: '',
         open: false
      })
      }

   addCustomer = () =>{
      const url='/api/customers';
      const formData = new FormData();
      formData.append('image', this.state.file);
      formData.append('name', this.state.userName);
      formData.append('birthday', this.state.birthday);
      formData.append('gender', this.state.gender);
      formData.append('job', this.state.job);
      //파일이 포함되는 데이터를 서버에 전송할때
      const config = {
         headers:{
            'content-type':'multipart/form-data'//전달하고자하는 데이터가 파일이 포함되어있다
         }
      }
      //axios 라이브러리
      return post(url, formData, config);
   }

   handleFileChange = (e) =>{
      this.setState({
         file: e.target.files[0],//하나의 파일만 올릴꺼니까
         fileName: e.target.value
      })
   }

   handleValueChange = (e) =>{
      let nextState = {};
      nextState[e.target.name] = e.target.value;
      this.setState(nextState);
   }
   
   handleClickOpen = () => {
      this.setState({
         open:true
      });
   }

   handleClose = () => {
      this.setState({
         file:null,
         userName: '',
         birthday: '',
         gender: '',
         job: '',
         fileName: '',
         open: false
      })
   }

   render(){
      const { classes } = this.props;
      return (
         <div>
            <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
               고객 추가하기
            </Button>
            <Dialog open={this.state.open} onClose = {this.handleClose}>
               <DialogTitle>고객추가</DialogTitle>
               <DialogContent>
                  <input className={classes.hidden} accept="image/*" id="raised-button-file" type="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/>
                  <label htmlFor="raised-button-file">
                     <Button variant="contained" color="primary" component="span" name="file"> 
                        {this.state.fileName === "" ? "프로필 이미지 선택" : this.state.fileName}
                     </Button>
                  </label><br/>
                  <TextField label="이름" type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange}/><br/>
                  <TextField label="생년월일" type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange}/><br/>
                  <TextField label="성별" type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange}/><br/>
                  <TextField label="직업" type="text" name="job" value={this.state.job} onChange={this.handleValueChange}/><br/>
               </DialogContent>
               <DialogActions>
                  <Button variant="contained" color="primary" onClick={this.handleFormSubmit}>추가</Button>
                  <Button variant="contained" color="primary" onClick={this.handleClose}>닫기</Button>
               </DialogActions>
            </Dialog>
         </div>
         /*<form onSubmit={this.handleFormSubmit}>
            <h1>고객 추가</h1>
            프로필 이미지: <input type="file" name="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/><br/>
            이름 : <input type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange}/><br/>
            생년월일: <input type="type" name="birthday" value={this.state.birthday} onChange={this.handleValueChange}/><br/>
            성별:<input type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange}/><br/>
            직업:<input type="text" name="job" value={this.state.job} onChange={this.handleValueChange}/><br/>
            <button type="submit">추가하기</button>
         </form>*/
      )
   }
}

 export default withStyles(styles)(CustomerAdd);