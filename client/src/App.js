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

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';


const styles = theme =>({
  root:{
    width: '100%',
    minWidth: 1080
  },
  menu:{
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'center'
  },
  progress: {
    margin : theme.spacing(2)
  },
  paper:{
    marginLeft: 48,
    marginRight: 48
  },
  tableHead:{
    fontSize: '1.0rem'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
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
      completed:0,
      searchKeyword:''
    }
    this.stateRefresh = this.stateRefresh.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this)
}

  stateRefresh = () =>{
    /*this.setState=({
      customers:'',
      completed:0,
      searchKeyword:''
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
    console.log('body', body)
    return body;
  }

  progress = () => {
    const { completed } = this.state;
    this.setState({completed: completed >= 100 ? 0 : completed+1});
  }

  handleValueChange(e){
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  render() {
    const filteredComponents = (data) =>{
      data = data.filter((c)=>{
        return c.name.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c)=>{
        return <Customer stateRefresh={this.stateRefresh} key={c.id} id={c.id} name={c.name} image={c.image} birthday={c.birthday} gender={c.gender} job={c.job}/>
      })
    }
    const { classes } = this.props;
    const cellList = [
      {id:1,title:"번호"},
      {id:2,title:"프로필 이미지"},
      {id:3,title:"이름"},
      {id:4,title:"생년월일"},
      {id:5,title:"성별"},
      {id:6,title:"직업"},
      {id:7,title:"설정"}
    ]
    return (
    <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
          <MenuIcon />
        </IconButton>
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
        고객 관리 시스템
        </Typography>
        <div className={classes.grow} />
        <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
        placeholder="검색하기"
        classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
        }}
        name="searchKeyword"
        value={this.state.searchKeyword}
        onChange={this.handleValueChange}
        />
        </div>
      </Toolbar>
    </AppBar>
    <div className={classes.menu}>
    <CustomerAdd stateRefresh={this.stateRefresh} />
    </div>
    <Paper className={classes.paper}>
      <Table>
      <TableHead>
        <TableRow>
        {cellList.map((c,i) => {
        return <TableCell className={classes.tableHead} key={i}>{c.title}</TableCell>
        })}
        </TableRow>
      </TableHead>
      <TableBody>
        {this.state.customers ?
          filteredComponents(this.state.customers) :
        <TableRow>
        <TableCell colSpan="6" align="center">
        <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed} />
        </TableCell>
        </TableRow>
        }
      </TableBody>
      </Table>
    </Paper>
    </div>
    );
    }
  }
    
  


export default withStyles(styles)(App);
