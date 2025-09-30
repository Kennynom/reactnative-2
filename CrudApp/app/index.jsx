import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { data } from '@/data/todos';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Index() {
  // swapping of a and b to ensure the highest id starts first
  const [todos, setTodos] = useState(data.sort((a, b) => b.id - a.id));
  const [text, setText] = useState('');
  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos])
      setText('');
    }
  }

  // to toggle the boolean of whether a task is done or not
  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id
        ? {...todo, completed: !todo.completed} : todo
    );
    setTodos(updatedTodos);
  }

  // to delete task
  const removeTodo = (id) => {
    const updatedTodos = todos.filter(todo =>
      todo.id !== id);
    setTodos(updatedTodos);
  }

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text 
        style={[styles.todoText, item.completed && styles.completedText]}
        onPress={() => toggleTodo(item.id)}
      >
        {item.title}
      </Text>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={36} color="peru" selectable={undefined}/>
      </Pressable>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput 
            style={styles.input}
            placeholder="Add a new todo"
            placeholderTextColor="gray"
            value={text}
            onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      padding: 10,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    input: {
      flex: 1,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      minWidth: 0,
      color: 'white',
    },
    addButton: {
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: 'black',
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      color: 'white',
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray',
    }
  })