import { View, Text, StyleSheet, Switch } from "react-native";


export default function AppBar({ isDarkMode, toggleTheme, colors }) {
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
            Weather App
        </Text>

        <View style={styles.themeToggle}>
            <Text style={[styles.mode, { color: colors.text }]}>
                {isDarkMode ? '🌙' : '☀️'}

            </Text>

            <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
            />

        </View>
    </View>
  );
}

const styles = StyleSheet.create({

    container: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4,
        verticalAlign: 'center',
        paddingBottom: -10,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        paddingVertical: 30,
    },
    mode: {
        marginRight: 8,
    },
    themeToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});