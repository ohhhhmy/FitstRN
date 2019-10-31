import React from 'react';
import { StyleSheet, Text, View, FlatList, AsyncStorage } from 'react-native';
import Header from './App/Components/Header';
import Subtitle from './App/Components/Subtitle';
import Input from './App/Components/Input';
import Listitem from './App/Components/Listitem';

export default class App extends React.Component() {
  constructor(props) {
    super(props);
    this.state = {
      inputValue:'',
      todos:[]
    }
  }
  componentWillMount() {
    this.getData()
  }
  storeData = () => {
    AsyncStorage.setItem('@todo:state', JSON.stringify(this.state));
  }

  getData = () => {
    AsyncStorage.getItem('@todo:state').then((state) =>{
      if(state !== null){
        this.setState(JSON.parse(state));
      }
    });
  }
  
  _makeTodoItem = ({item, index}) => {
    return (
      <Listitem
        name = {item.title}
        iscomplete = {item.iscomplete}
        changeComplete = {() => {
          const newTodo = [...this.state.todos]
          newTodo[index].iscomplete = !newTodo[index].iscomplete
          this.setState({todos:newTodo}, this.storeData)
        }}
        deleteItem = {() => {
          const newTodo = [...this.state.todos]
          newTodo.splice(index, 1)
          this.setState({todos:newTodo}, this.storeData)
        }}/>
    );
  }
  _changeText = (value) => {
    this.setState({inputValue : value});
  }
  _addTodoItem = () => {
    if(this.state.InputValue !== "") {
      const prevTodo = this.state.todos

      const newTodo = {title : this.state.inputValue, iscomplete : false}
      
      this.setState({
        inputValue : '',
        todos : prevTodo.concat(newTodo)
      }, this.storeData);
    }
  }
  render() {
  return (
    <View style={styles.container}>
      <View style ={styles.headercenter}>
        <Header/>
      </View>
      <View style = {styles.subtitleposition}>
        <Subtitle title = "해야 할 일"/>
        <Input
          value = {this.state.inputValue}
          chancgeText = {this._changeText}
          addTodoItem = {this._addTodoItem}/>
      </View>
      <View style = {styles.subtitleposition}>
        <Subtitle title = "해야 할 일 목록"/>
        <Listitem name = "코딩하기"/>
        <Listitem name = "운동가기"/>
        <Listitem name = {this.state.todos[0].title}/>
      
        <FlatList
          data = {this.state.todos}
          renderItem = {this._makeTodoItem}
          keyExtractor = {(item, index) => {return '$(index)'}}/>
      </View>
    </View>
  );
};
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#542669',
  },
  headercenter : {
    alignItems : "center",
    borderWidth : 5,
  },
  subtitleposition : {
    marginLeft : 50,
  },
});
