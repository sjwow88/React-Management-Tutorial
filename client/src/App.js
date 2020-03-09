import React, { Component } from 'react';
import Customer from './components/Customer';
import CustomerAdd from './components/CustomerAdd';
import './App.css';
import Paper from '@material-ui/core/Paper';//컴포넌트 외부를 감싼다
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme =>({
  root:{
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table:{
    minWidth: 1080
  },
  progress: {
    margin : theme.spacing(2)
  }
})


/* 컴포넌트 실행 순서
1) constructor()
2) componentWillMount()
3) render()
4) componentDidMount()
*/

/*
 props or state => shoudComponentUpdate()
 */

class App extends Component {
  //변경될수 있는 데이터 state
 
constructor(props){
    super(props);
    this.state={
      customers:'',
      completed:0
    }

    
    //this.progress = this.progress.bind(this);
    //this.stateRefresh = this.stateRefresh.bind(this);
  }

  stateRefresh = () =>{
    /*this.setState=({
      customers:'',
      completed:0
    });*/
    this.callApi()
      .then(res => {this.setState({customers:res})})
      .catch(err => console.log(err));
  }

  //모든 컴포넌트가 준비완료
  componentDidMount(){
    this.timer = setInterval(this.progress,20);
    this.callApi()
      .then(res => {this.setState({customers:res})})
      .catch(err => console.log(err));
  }
  
  callApi = async()=>{
    const response = await fetch('/api/customers');
    const body = await response.json();
    return body;
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({completed: completed >= 100 ? 0 : completed+1});
  }
  render(){
    const { classes } = this.props;
    this.stateRefresh = this.stateRefresh.bind(this);
    return (
      <div>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>이미지</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>생년월일</TableCell>
                <TableCell>성별</TableCell>
                <TableCell>직업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
          { this.state.customers ? this.state.customers.map(c =>{
              return( 
              <Customer
                key={c.id}
                id={c.id}
                image={c.image}
                name={c.name}
                birthday={c.birthday}
                gender={c.gender}
                job={c.job}
                />
              );
            }): 
              <TableRow>
                <TableCell colSpan="6" align="center">
                  <CircularProgress className="classes.progress" variant="determinate" value={this.state.completed}/>
                </TableCell>
              </TableRow>
            }
            </TableBody>
          </Table>
        </Paper>
        <CustomerAdd stateRefresh={this.stateRefresh}/>
      </div>
    );
  }
}

export default withStyles(styles)(App);
