import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import PageHeader from '../../components/PageHeader';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage'

import TeacherItem, { Teacher } from '../../components/TeacherItem';
import api from '../../services/api';

import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';


function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  // Numeric array.
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  function loadFavorites(){
        // It is not a Relational Database.
    // Store only text. Use JSON.
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {
        const favoriteTeachers = JSON.parse(response);
        const favoriteTeachersIds = favoriteTeachers.map((teacher:Teacher) => {
          return teacher.id;
        })
        setFavorites(favoriteTeachersIds);
      }
    });
  }

  useFocusEffect(() => {
    loadFavorites();
  })

  function handleToggleFiltersVisible() {
    setIsFilterVisible(!isFilterVisible);
  }

  async function handleFilterSubmit() {
    loadFavorites();

    // Query params
    const response = await api.get('/classes', {
      params: {
        subject,
        week_day,
        time
      }
    });
    setTeachers(response.data);
    console.log(response.data);
    console.log({
      subject,
      week_day,
      time
    });
    setIsFilterVisible(false);
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys disponíveis"
        headerRight={(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color="#FFF" />
          </BorderlessButton>
        )}
      >
        {isFilterVisible && (
          <View style={styles.searchForm}>
            < Text style={styles.label}>Matéria</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={text => setSubject(text)}
              placeholder="Qual a matéria?"
              placeholderTextColor='#c1bccc'
            ></TextInput>

            <View style={styles.inputGroup}>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput
                  style={styles.input}
                  value={week_day}
                  onChangeText={text => setWeekDay(text)}
                  placeholder="Qual é o dia?"
                  placeholderTextColor='#c1bccc'
                ></TextInput>
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={text => setTime(text)}
                  placeholder="Qual horário?"
                  placeholderTextColor='#c1bccc'
                ></TextInput>
              </View>
            </View>
            <RectButton style={styles.submitButton} onPress={handleFilterSubmit}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>

          </View>
        )}
      </PageHeader>


      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16
        }}
      >
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem 
              key={teacher.id} 
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
            ></TeacherItem>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default TeacherList;