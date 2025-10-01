import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, StyleSheet, Pressable, TextInput, Platform } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import { StatusBar } from "expo-status-bar";
import { Inter_900Black_Italic, useFonts } from '@expo-google-fonts/inter';
import { Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function EditScreen() {
    const { id } = useLocalSearchParams();
    const [todo, setTodo] = useState([]);
    const router = useRouter();
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);

    const [fontsLoaded] = useFonts({
        Inter_900Black_Italic, 
    });
    
    useEffect(() => {   
        const fetchData = async (id) => {
            try {
                // Fetch todo from AsyncStorage called "TodoApp"
                const jsonValue = await AsyncStorage.getItem("TodoApp")
                // Parse the JSON string into an object if it exists
                const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

                // If todo exist in storage and storageTodos is not empty/has length, update the state
                if (storageTodos && storageTodos.length) {
                    // for each todo in storageTodos, check if the id matches the id from the route params
                    // if it matches, set that todo as the state
                    const myTodo = storageTodos.find(todo => todo.id.toString() === id);
                    setTodo(myTodo);
                }
            } catch (error) {
                console.error("Error fetching todos:", error);
            }
        };
        fetchData(id);
    }, [id]);

    if (!fontsLoaded)
    {
        return null;
    }

    // Create styles using the current theme and color scheme
    const styles = createStyles(theme, colorScheme);

    const handleSave = async () => {
        try {
            // Save the updated todo into a new object called savedTodo
            const savedTodo = {...todo, title: todo.title };

            // Retrieve existing todos from AsyncStorage 
            const jsonValue = await AsyncStorage.getItem("TodoApp");

            // Parse the JSON string into an object called storageTodos if it exists
            const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : [];

            // If todo exist in storage and storageTodos is not empty/has length
            if (storageTodos && storageTodos.length) {
                // Filter out the old version of the todo being updated
                const otherTodos = storageTodos.filter(todo => todo.id !== savedTodo.id);
                // Combine the other todos with the updated todo
                const allTodos = [...otherTodos, savedTodo];
                // Save the combined list back to AsyncStorage
                await AsyncStorage.setItem("TodoApp", JSON.stringify(allTodos));
            } else {
                // If no existing todos, just save the new todo as the only item in an array
                await AsyncStorage.setItem("TodoApp", JSON.stringify([savedTodo]));
            }
            // Navigate back to the main screen after saving
            router.push('/');
        } catch (error) {
            console.error("Error saving todo:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    maxlength={30}
                    placeholder="Edit todo"
                    placeholderTextColor='gray'
                    value={todo?.title || ''}
                    onChangeText={(text) => setTodo({ ...todo, title: text })}
                />
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
            <View style={styles.inputContainer}>
                <Pressable
                    onPress={handleSave}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/')}
                    style={[styles.saveButton, { backgroundColor: 'red' }]}
                >
                    <Text style={[styles.saveButtonText, { color: 'white' }]}>Cancel</Text>
                </Pressable>
            </View>
            {(Platform.OS === 'android' || Platform.OS === 'ios') && <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />}
        </SafeAreaView>  
    )
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: theme.background,
        },inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap: 6,
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
            fontFamily: 'Inter_500Medium',
            minWidth: 0,
            color: theme.text,
        },
        saveButton: {
            backgroundColor: theme.button,
            borderRadius: 5,
            padding: 10,
        },
        saveButtonText: {
            fontSize: 18,
            color: colorScheme === 'dark' ? 'black' : 'white',
        }
    });
}