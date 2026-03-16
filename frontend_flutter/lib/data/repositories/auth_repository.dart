import '../../core/services/api_service.dart';
import '../models/user_model.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthRepository {
  Future<UserModel> login(String email, String password) async {
    final response = await ApiService.post('/auth/login', {
      'email': email,
      'password': password,
    });
    
    final user = UserModel.fromJson(response.data['data']['user']);
    final token = response.data['data']['token'];
    
    await _saveToken(token);
    ApiService.setToken(token);
    
    return user.copyWith(token: token);
  }

  Future<UserModel> register(String name, String email, String password) async {
    final response = await ApiService.post('/auth/register', {
      'name': name,
      'email': email,
      'password': password,
    });
    
    final user = UserModel.fromJson(response.data['data']['user']);
    final token = response.data['data']['token'];
    
    await _saveToken(token);
    ApiService.setToken(token);
    
    return user.copyWith(token: token);
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }
}

extension on UserModel {
  UserModel copyWith({String? token}) {
    return UserModel(
      id: id,
      name: name,
      email: email,
      token: token ?? this.token,
    );
  }
}
