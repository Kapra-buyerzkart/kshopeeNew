import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '../../assets/theme/colours';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import InputField from '../../components/TextField';

import { useUser } from '../../context/UserContext';
import StatusModal from '../../components/StatusModal';
import { updateProfilePatchApi } from '../../api/services/userService';
import { wp, hp } from '../../utils/responsive';

const EditProfile: React.FC = () => {
  const navigation = useNavigation();
  const { profile, loadProfile } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({ title: '', message: '', type: 'success' });

  const showModal = (
    title: string,
    message: string,
    type: 'success' | 'error',
  ) => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  // State for inputs
  const [fullName, setFullName] = useState(profile?.custName || '');
  const [pincode, setPincode] = useState(profile?.pincode?.toString() || '');
  const [gender, setGender] = useState(profile?.gender || ''); // 'Male', 'Female', 'Other'
  const [dob, setDob] = useState(
    profile?.dob ? new Date(profile.dob) : new Date(2000, 0, 1),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Disabled fields that display read-only information
  const email = profile?.emailId || '';
  const phone = profile?.phoneNo || '';

  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isNameChanged = fullName.trim() !== (profile?.custName || '');
    const isPincodeChanged =
      pincode.trim() !== (profile?.pincode?.toString() || '');
    const isGenderChanged = gender !== (profile?.gender || '');
    const isDobChanged = profile?.dob
      ? new Date(profile.dob).toDateString() !== dob.toDateString()
      : true;

    setHasChanges(
      isNameChanged || isPincodeChanged || isGenderChanged || isDobChanged,
    );
  }, [fullName, pincode, gender, dob, profile]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      showModal('Error', 'Name is required', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        fullName: fullName.trim(),
        pincode: pincode.trim(),
        gender: gender,
        dob: dob.toISOString().split('T')[0], // Format: YYYY-MM-DD
      };
      const response = await updateProfilePatchApi(payload);

      if (response?.success) {
        await loadProfile(); // Refresh global profile state
        showModal('Success', 'Profile updated successfully', 'success');
      } else {
        showModal(
          'Error',
          response?.message || 'Failed to update profile',
          'error',
        );
      }
    } catch (error: any) {
      console.error('Update Profile Error:', error);
      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.message || error?.Message || 'An unexpected error occurred';
      showModal('Error', errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const renderGenderOption = (option: string) => (
    <TouchableOpacity
      key={option}
      style={[
        localStyles.genderOption,
        gender === option && localStyles.genderOptionSelected,
      ]}
      onPress={() => setGender(option)}
    >
      <Text
        style={[
          localStyles.genderText,
          gender === option && localStyles.genderTextSelected,
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.editProfileContainer,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
        translucent={false}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        >
          {/* Header Section */}
          <View style={styles.editProfileHeader}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <AppIcons.ArrowBack size={28} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.editProfileTitle}>Edit Profile</Text>
            {/* <TouchableOpacity style={styles.editProfileCartIconBg}>
              <AppIcons.Bag size={20} color={colors.white} />
            </TouchableOpacity> */}
          </View>

          {/* Form Section */}
          <View style={styles.editProfileFormContainer}>
            <InputField
              label="Name"
              placeholder="Enter name"
              placeholderTextColor={colors.gray || '#DADADA'}
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={localStyles.genderContainer}>
                {['Male', 'Female', 'Other'].map(renderGenderOption)}
              </View>
            </View>

            {/* DOB Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={[
                    styles.textInput,
                    { textAlignVertical: 'center', paddingTop: hp('1.5%') },
                  ]}
                >
                  {dob.toLocaleDateString('en-GB')}
                </Text>
                <AppIcons.Calendar size={20} color={colors.themeTeal} />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={dob}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={onDateChange}
              />
            )}

            <InputField
              label="Pin code"
              placeholder="00 00 00"
              placeholderTextColor={colors.gray || '#DADADA'}
              keyboardType="numeric"
              maxLength={6}
              value={pincode}
              onChangeText={setPincode}
            />

            <View style={{ opacity: 0.6 }}>
              <InputField
                label="Email ID (Update from Security)"
                placeholder="Enter email"
                placeholderTextColor={colors.gray || '#DADADA'}
                value={email}
                editable={false}
              />
            </View>

            <View style={{ opacity: 0.6 }}>
              <InputField
                label="Phone Number (Update from Security)"
                placeholder="Enter phone"
                placeholderTextColor={colors.gray || '#DADADA'}
                value={phone}
                editable={false}
              />
            </View>

            <TouchableOpacity
              style={{
                backgroundColor:
                  !hasChanges || isLoading
                    ? colors.themeTeal
                    : colors.themeTeal,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                marginTop: 30,
              }}
              onPress={handleSave}
              disabled={!hasChanges || isLoading}
            >
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <StatusModal
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('0.5%'),
  },
  genderOption: {
    flex: 1,
    height: hp('5.5%'),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: wp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp('1%'),
    backgroundColor: colors.white,
  },
  genderOptionSelected: {
    backgroundColor: colors.themeTeal,
    borderColor: colors.themeTeal,
  },
  genderText: {
    fontSize: 14,
    color: '#616161',
    fontFamily: 'Gilroy-Medium',
  },
  genderTextSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default EditProfile;
