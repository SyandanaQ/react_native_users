import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get('http://192.168.197.170:3001/users')  // Ganti dengan IP lokal baru
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const addUser = () => {
    if (name && email) {
      axios.post('http://192.168.197.170:3001/users', { name, email })
        .then(response => {
          setUsers([...users, response.data]);
          setName('');
          setEmail('');
        })
        .catch(error => {
          console.error(error);
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
      axios.put(`http://192.168.197.170:3001/users/${editingUser.id}`, { name, email })
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
          console.error(error);
        });
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
  };

  const deleteUser = (id: number) => {
    // Tampilkan dialog konfirmasi sebelum menghapus
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
            axios.delete(`http://192.168.197.170:3001/users/${id}`)
              .then(() => {
                setUsers(users.filter(user => user.id !== id));
              })
              .catch(error => {
                console.error(error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daftar Users:</Text>
      
      {/* Tabel Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.columnHeader}>Nama</Text>
        <Text style={styles.columnHeader}>Email</Text>
        <Text style={styles.columnHeader}>Actions</Text>
      </View>

      {/* Tabel Body */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{item.email}</Text>
            <View style={styles.actions}>
              <Button title="Edit" onPress={() => editUser(item)} />
              <Button title="Delete" onPress={() => deleteUser(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Form input untuk Tambah/Edit User */}
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
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 20,
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
    width: 150,
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
