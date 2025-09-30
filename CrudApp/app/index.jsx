import { Text, View, TextInput, Pressable, StyleSheet, FlatList, Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from '@/context/ThemeContext';

import { data } from '@/data/todos';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { Inter_900Black_Italic, useFonts } from '@expo-google-fonts/inter';
import Animated, { LinearTransition } from 'react-native-reanimated';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";


export default function Index() {
  // swapping of a and b to ensure the highest id starts first
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);

  const [fontsLoaded] = useFonts({
    Inter_900Black_Italic, 
  });

  // load the updated data from AsyncStorage upon app start. otherwise load the default data (data.js)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

        if (storageTodos && storageTodos.length) {
          setTodos(storageTodos.sort((a, b) => b.id - a.id))
        } else {
          setTodos(data.sort((a, b) => b.id - a.id))
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchData()
  }, [data])

  // any changes made is updated to AsyncStorage  r
  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos)
        await AsyncStorage.setItem("TodoApp", jsonValue)
      } catch (e) {
        console.error(e)
      }
    }

    storeData()
  }, [todos])
  
  if (!fontsLoaded)
  {
    return null;
  }

  const styles = createStyles(theme, colorScheme);

  // to add new todo 
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

  // list of added items
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
        <Pressable 
          onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} 
          style ={{ marginLeft: 10}}>
            {colorScheme === 'dark'
              ? <Octicons 
                  name="moon" 
                  size ={36} 
                  color={theme.text} 
                  selectable={undefined}
                  style={{ width: 36 }}
                />
              : <Octicons 
                  name="sun" 
                  size ={36} 
                  color={theme.text} 
                  selectable={undefined}
                  style={{ width: 36 }}
                />
            }
        </Pressable>
      </View>

      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id}
        contentContainerStyle={{ flexGrow: 1 }}
        // this animates
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
      {Platform.OS === 'android' && <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />}
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
      fontFamily: 'Inter_900Black_Italic',
      minWidth: 0,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'white',
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
      color: theme.text,
      fontFamily: 'Inter_900Black_Italic',
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray',
    }
  })
};