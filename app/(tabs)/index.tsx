import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

interface User {
  id: number;
  name: string;
  email: string;
}

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const API_URL = Constants.expoConfig?.extra?.apiUrl;

  useEffect(() => {
    axios.get(`${API_URL}/users`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Gagal mengambil data:', error);
      });
  }, []);

  const addUser = () => {
    if (name && email) {
      axios.post(`${API_URL}/users`, { name, email })
        .then(response => {
          setUsers([...users, response.data]);
          setName('');
          setEmail('');
        })
        .catch(error => {
          console.error('Gagal menambahkan user:', error);
        });
    }
  };

  const editUser = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setEditingUser(user);
  };

  const saveUser = () => {
    if (editingUser) {
      axios.put(`${API_URL}/users/${editingUser.id}`, { name, email })
        .then(response => {
          const updatedUsers = users.map(user =>
            user.id === editingUser.id ? response.data : user
          );
          setUsers(updatedUsers);
          setEditingUser(null);
          setName('');
          setEmail('');
        })
        .catch(error => {
          console.error('Gagal menyimpan perubahan:', error);
        });
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
  };

  const deleteUser = (id: number) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus user ini?',
      [
        {
          text: 'Batal',
          onPress: () => console.log('Hapus dibatalkan'),
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => {
            axios.delete(`${API_URL}/users/${id}`)
              .then(() => {
                setUsers(users.filter(user => user.id !== id));
              })
              .catch(error => {
                console.error('Gagal menghapus user:', error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daftar Users</Text>

      {/* Daftar User */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.tableHeader}>
            <Text style={styles.columnHeader}>Nama</Text>
            <Text style={styles.columnHeader}>Email</Text>
            <Text style={styles.columnHeader}>Aksi</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{item.email}</Text>
            <View style={styles.actions}>
              <Button title="Edit" onPress={() => editUser(item)} />
              <Button title="Hapus" onPress={() => deleteUser(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Form Tambah/Edit */}
      <TextInput
        style={styles.input}
        placeholder="Nama"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {editingUser ? (
        <View style={styles.buttonContainer}>
          <Button title="Simpan" onPress={saveUser} />
          <Button title="Batal" onPress={cancelEdit} />
        </View>
      ) : (
        <Button title="Tambah User" onPress={addUser} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 130,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Index;
