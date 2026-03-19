// src/components/icons/CustomIcons.tsx
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialDesignIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { ViewStyle, StyleProp } from 'react-native';
import { colors } from '../theme/colours';

interface IconProps {
    size?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
}

const defaultSize = 24;

// Icon components with default props
const Home = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="home-outline" size={size} color={color} style={style} />
);

const User = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome name="user" size={size} color={color} style={style} />
);

const Delete = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="delete" size={size} color={color} style={style} />
);

const Group = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="group" size={size} color={color} style={style} />
);

const PeopleCarry = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome5 name="people-carry" size={size} color={color} style={style} />
);

const Back = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="chevron-back" size={size} color={color} style={style} />
);

const Settings = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Feather name="settings" size={size} color={color} style={style} />
);

const Add = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="add" size={size} color={color} style={style} />
);

const Menu = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="menu" size={size} color={color} style={style} />
);

const Forward = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="chevron-forward" size={size} color={color} style={style} />
);

const Person = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="person" size={size} color={color} style={style} />
);

const CheckMark = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="checkmark" size={size} color={color} style={style} />
);

const ArrowDown = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="keyboard-arrow-down" size={size} color={color} style={style} />
);

const ArrowUp = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="keyboard-arrow-up" size={size} color={color} style={style} />
);

const Search = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="search" size={size} color={color} style={style} />
);

const Close = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="close" size={size} color={color} style={style} />
);

const ShoppingCart = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="shopping-cart" size={size} color={color} style={style} />
);

const ViewModule = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="view-module" size={size} color={color} style={style} />
);

const ViewList = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="view-list" size={size} color={color} style={style} />
);

const Check = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="check" size={size} color={color} style={style} />
);

const ArrowLeft = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="arrow-back" size={size} color={color} style={style} />
);

const ChevronRight = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="chevron-right" size={size} color={color} style={style} />
);

const History = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome name="history" size={size} color={color} style={style} />
);
const NavIcon = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome name="navicon" size={size} color={color} style={style} />
);

const Phone = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="phone" size={size} color={color} style={style} />
);

const Email = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="email" size={size} color={color} style={style} />
);

const Filter = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="filter-list" size={size} color={color} style={style} />
);

const Edit = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="edit" size={size} color={color} style={style} />
);

const X = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="close" size={size} color={color} style={style} />
);

const Food = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="food" size={size} color={color} style={style} />
);

const CreditCard = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="credit-card" size={size} color={color} style={style} />
);

const UserCircle = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome name="user-circle" size={size} color={color} style={style} />
);

const Calendar = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="calendar-today" size={size} color={color} style={style} />
);

const Users = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome5 name="users" size={size} color={color} style={style} />
);

const EyeOpen = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="eye" size={size} color={color} style={style} />
);

const EyeClose = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="eye-off" size={size} color={color} style={style} />
);
const Bag = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="bag-outline" size={size} color={color} style={style} />
);
const Bell = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialDesignIcons name="bell-outline" size={size} color={color} style={style} />
);

const Microphone = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome name="microphone" size={size} color={color} style={style} />
);



// Exporting all as object for named JSX usage
export const AppIcons = {
    Home,
    User,
    Delete,
    Back,
    Settings,
    Add,
    Menu,
    Forward,
    Person,
    CheckMark,
    Group,
    ArrowDown,
    ArrowUp,
    Search,
    Close,
    ShoppingCart,
    ViewModule,
    ViewList,
    Check,
    ArrowLeft,
    ChevronRight,
    History,
    NavIcon,
    Phone,
    Email,
    Filter,
    X,
    Food,
    PeopleCarry,
    CreditCard,
    UserCircle,
    Calendar,
    Edit,
    Users,
    EyeOpen,
    EyeClose,
    Bag,
    Bell,
    Microphone
};
