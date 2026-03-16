import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/utils/validators.dart';
import '../../core/utils/helpers.dart';
import '../../data/models/crop_model.dart';
import '../../presentation/providers/crop_provider.dart';
import '../../core/constants/app_constants.dart';

class CropEntryScreen extends StatefulWidget {
  final String farmerId;

  const CropEntryScreen({required this.farmerId, Key? key}) : super(key: key);

  @override
  State<CropEntryScreen> createState() => _CropEntryScreenState();
}

class _CropEntryScreenState extends State<CropEntryScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _cropNameController = TextEditingController();
  final TextEditingController _areaController = TextEditingController();

  String _selectedCropType = 'Cereal';
  String _selectedSeason = 'Kharif';
  DateTime _sowingDate = DateTime.now();

  bool _isLoading = false;

  final List<String> _cropTypes = [
    'Cereal',
    'Pulse',
    'Vegetable',
    'Fruit',
    'Cash Crop'
  ];

  final List<String> _seasons = ['Kharif', 'Rabi', 'Zaid'];

  Future<void> _saveCrop() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final crop = CropModel(
        farmerId: widget.farmerId,
        cropName: _cropNameController.text.trim(),
        cropType: _selectedCropType,
        area: double.parse(_areaController.text),
        season: _selectedSeason,
        sowingDate: _sowingDate,
      );

      // 🔍 Debug: print crop data
      debugPrint("------ Crop Data ------");
      debugPrint("Farmer ID: ${crop.farmerId}");
      debugPrint("Crop Name: ${crop.cropName}");
      debugPrint("Crop Type: ${crop.cropType}");
      debugPrint("Area: ${crop.area}");
      debugPrint("Season: ${crop.season}");
      debugPrint("Sowing Date: ${crop.sowingDate}");
      debugPrint("----------------------");

      await context.read<CropProvider>().addCrop(crop);

      Helpers.showSnackBar(context, "Crop saved (offline sync enabled)");

      Navigator.pop(context);
    } catch (e) {
      Helpers.showSnackBar(context, "Failed to add crop", isError: true);
    }

    setState(() => _isLoading = false);
  }

  Widget _buildSectionTitle(String title) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Color(AppConstants.primaryColor),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(AppConstants.secondaryColor).withOpacity(0.1),
      appBar: AppBar(
        title: const Text("Add Crop"),
        backgroundColor: const Color(AppConstants.primaryColor),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Card(
          elevation: 4,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: Column(
                children: [

                  Icon(Icons.grass,
                      size: 80, color: Color(AppConstants.primaryColor)),

                  const SizedBox(height: 25),

                  _buildSectionTitle("Crop Name"),

                  TextFormField(
                    controller: _cropNameController,
                    decoration: InputDecoration(
                      hintText: "Enter crop name",
                      prefixIcon: const Icon(Icons.agriculture),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    validator: (v) =>
                        Validators.validateRequired(v, "Crop Name"),
                  ),

                  const SizedBox(height: 20),

                  _buildSectionTitle("Crop Type"),

                  DropdownButtonFormField<String>(
                    value: _selectedCropType,
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.category),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    items: _cropTypes
                        .map((type) => DropdownMenuItem(
                      value: type,
                      child: Text(type),
                    ))
                        .toList(),
                    onChanged: (v) =>
                        setState(() => _selectedCropType = v!),
                  ),

                  const SizedBox(height: 20),

                  _buildSectionTitle("Area (Acres)"),

                  TextFormField(
                    controller: _areaController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.square_foot),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    validator: (v) => Validators.validateRequired(v, "Area"),
                  ),

                  const SizedBox(height: 20),

                  _buildSectionTitle("Season"),

                  DropdownButtonFormField<String>(
                    value: _selectedSeason,
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.wb_sunny),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    items: _seasons
                        .map((season) => DropdownMenuItem(
                      value: season,
                      child: Text(season),
                    ))
                        .toList(),
                    onChanged: (v) =>
                        setState(() => _selectedSeason = v!),
                  ),

                  const SizedBox(height: 20),

                  _buildSectionTitle("Sowing Date"),

                  ListTile(
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: const BorderSide(color: Colors.grey)),
                    leading: const Icon(Icons.calendar_today),
                    title: Text(Helpers.formatDate(_sowingDate)),
                    onTap: () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: _sowingDate,
                        firstDate: DateTime(2020),
                        lastDate: DateTime.now(),
                      );

                      if (date != null) {
                        setState(() => _sowingDate = date);
                      }
                    },
                  ),

                  const SizedBox(height: 30),

                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.save),
                      label: _isLoading
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text("Save Crop"),
                      onPressed: _isLoading ? null : _saveCrop,
                      style: ElevatedButton.styleFrom(
                        backgroundColor:
                        const Color(AppConstants.primaryColor),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}