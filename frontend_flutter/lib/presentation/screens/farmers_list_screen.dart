import 'package:flutter/material.dart';
import '../providers/farmer_provider.dart';
import '../widgets/farmer_card.dart';
import 'package:provider/provider.dart';

class FarmersListScreen extends StatefulWidget {
  @override
  _FarmersListScreenState createState() => _FarmersListScreenState();
}

class _FarmersListScreenState extends State<FarmersListScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Farmers List'),
        backgroundColor: Color(0xFF2E7D32),
        actions: [
          IconButton(
            icon: Icon(Icons.wb_sunny),
            onPressed: () => Navigator.pushNamed(context, '/weather'),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search by name, village, or mobile',
                prefixIcon: Icon(Icons.search),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                        },
                      )
                    : null,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onChanged: (value) {
                setState(() => _searchQuery = value.toLowerCase());
              },
            ),
          ),
          Expanded(
            child: Consumer<FarmerProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading) {
                  return Center(child: CircularProgressIndicator());
                }

                final filteredFarmers = provider.farmers.where((farmer) {
                  if (_searchQuery.isEmpty) return true;
                  return farmer.name.toLowerCase().contains(_searchQuery) ||
                      farmer.village.toLowerCase().contains(_searchQuery) ||
                      farmer.mobile.contains(_searchQuery);
                }).toList();

                if (filteredFarmers.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.people_outline, size: 80, color: Colors.grey),
                        SizedBox(height: 16),
                        Text(
                          _searchQuery.isEmpty
                              ? 'No farmers registered yet'
                              : 'No farmers found',
                          style: TextStyle(fontSize: 18, color: Colors.grey),
                        ),
                      ],
                    ),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () => provider.loadFarmers(),
                  child: ListView.builder(
                    padding: EdgeInsets.all(16),
                    itemCount: filteredFarmers.length,
                    itemBuilder: (context, index) {
                      return FarmerCard(farmer: filteredFarmers[index]);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/farmer-registration'),
        backgroundColor: Color(0xFF2E7D32),
        child: Icon(Icons.add),
      ),
    );
  }
}
