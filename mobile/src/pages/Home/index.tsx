import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { 
  View,
  ImageBackground,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

import styles from './style';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface UfsCities {
  label: string;
  value: string;
}

const Home = () => {
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');
  const [ufs, setUfs] = useState<UfsCities[]>([]);
  const [cities, setCities] = useState<UfsCities[]>([]);


  const navigation = useNavigation()

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const initialUfs = response.data.map(uf => {
          return {
            label: uf.sigla,
            value: uf.sigla
          }
        })
        
        setUfs(initialUfs)
      })
  }, [])

  useEffect(() => {
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then(response => {
        const initialCities = response.data.map(city => {
          return {
            label: city.nome,
            value: city.nome
          }
        })

        setCities(initialCities)
      })
  }, [uf])

  function handleNavigationToPoinst() {
    navigation.navigate('Points', {
      uf,
      city
    })
  }

  return (
    <KeyboardAvoidingView 
      style={{flex: 1}} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ImageBackground 
      source={require('../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <View>
          <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.input}>
          <RNPickerSelect
            placeholder={{ label: 'Selecione UF', value: null }}
            useNativeAndroidPickerStyle={true}
            onValueChange={value => setUf(value)}
            items={ufs}
          />
        </View>

        <View style={styles.input}>
          <RNPickerSelect
            placeholder={{ label: 'Selecione Cidade', value: null }}
            useNativeAndroidPickerStyle={true}
            onValueChange={value => setCity(value)}
            items={cities}
          />
        </View>

        <RectButton style={styles.button} onPress={handleNavigationToPoinst}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default Home;
