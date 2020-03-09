import React from 'react';
import {post} from 'axios';

class CustomerAdd extends React.Component{
   constructor(props){
      super(props);
      this.state = {
         file:null,
         userName: '',
         birthday: '',
         gender: '',
         job: '',
         fileName: ''
      }
   }

   handleFormSubmit = (e) =>{
      e.preventDefault();
      
      this.addCustomer()
         .then((response) =>{
            console.log(response.data);
            this.props.stateRefresh();
         })
         
      this.setState({
         file:null,
         userName: '',
         birthday: '',
         gender: '',
         job: '',
         fileName: ''
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

   render(){
      return (
         <form onSubmit={this.handleFormSubmit}>
            <h1>고객 추가</h1>
            프로필 이미지: <input type="file" name="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/><br/>
            이름 : <input type="text" name="userName" value={this.state.userName} onChange={this.handleValueChange}/><br/>
            생년월일: <input type="type" name="birthday" value={this.state.birthday} onChange={this.handleValueChange}/><br/>
            성별:<input type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange}/><br/>
            직업:<input type="text" name="job" value={this.state.job} onChange={this.handleValueChange}/><br/>
            <button type="submit">추가하기</button>
         </form>
      )
   }
}

 export default CustomerAdd;