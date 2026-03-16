import 'package:flutter/material.dart';
import '../../core/utils/validators.dart';
import '../../core/utils/helpers.dart';
import '../../core/services/location_service.dart';
import '../../data/models/farmer_model.dart';
import '../providers/farmer_provider.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';

class FarmerRegistrationScreen extends StatefulWidget {
  @override
  _FarmerRegistrationScreenState createState() => _FarmerRegistrationScreenState();
}

class _FarmerRegistrationScreenState extends State<FarmerRegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _villageController = TextEditingController();
  final _mobileController = TextEditingController();
  final _addressController = TextEditingController();
  bool _isLoading = false;
  Position? _currentPosition;

  Future<void> _getLocation() async {
    setState(() => _isLoading = true);
    final position = await LocationService.getCurrentLocation();
    setState(() {
      _currentPosition = position;
      _isLoading = false;
    });
    if (position != null) {
      Helpers.showSnackBar(context, 'Location captured: ${position.latitude}, ${position.longitude}');
    } else {
      Helpers.showSnackBar(context, 'Failed to get location', isError: true);
    }
  }

  Future<void> _saveFarmer() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final farmer = FarmerModel(
        name: _nameController.text,
        village: _villageController.text,
        mobile: _mobileController.text,
        address: _addressController.text,
        latitude: _currentPosition?.latitude,
        longitude: _currentPosition?.longitude,
      );

      await Provider.of<FarmerProvider>(context, listen: false).addFarmer(farmer);
      Helpers.showSnackBar(context, 'Farmer registered successfully');
      Navigator.pop(context);
    } catch (e) {
      Helpers.showSnackBar(context, 'Failed to register farmer', isError: true);
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Register Farmer'),
        backgroundColor: Color(0xFF2E7D32),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Icon(Icons.person_add, size: 80, color: Color(0xFF2E7D32)),
              SizedBox(height: 24),
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: 'Farmer Name',
                  prefixIcon: Icon(Icons.person),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                validator: (v) => Validators.validateRequired(v, 'Name'),
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _villageController,
                decoration: InputDecoration(
                  labelText: 'Village',
                  prefixIcon: Icon(Icons.location_city),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                validator: (v) => Validators.validateRequired(v, 'Village'),
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _mobileController,
                decoration: InputDecoration(
                  labelText: 'Mobile Number',
                  prefixIcon: Icon(Icons.phone),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                validator: Validators.validatePhone,
                keyboardType: TextInputType.phone,
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _addressController,
                decoration: InputDecoration(
                  labelText: 'Address (Optional)',
                  prefixIcon: Icon(Icons.home),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                maxLines: 3,
              ),
              SizedBox(height: 16),
              Card(
                child: ListTile(
                  leading: Icon(Icons.location_on, color: Color(0xFF2E7D32)),
                  title: Text(_currentPosition == null ? 'Capture Location' : 'Location Captured'),
                  subtitle: _currentPosition != null
                      ? Text('${_currentPosition!.latitude.toStringAsFixed(4)}, ${_currentPosition!.longitude.toStringAsFixed(4)}')
                      : Text('Tap to get GPS coordinates'),
                  trailing: Icon(Icons.gps_fixed),
                  onTap: _getLocation,
                ),
              ),
              SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _saveFarmer,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF2E7D32),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: _isLoading
                      ? CircularProgressIndicator(color: Colors.white)
                      : Text('Register Farmer', style: TextStyle(fontSize: 16)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
