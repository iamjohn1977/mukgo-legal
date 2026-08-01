# R8 rules for a Capacitor WebView app.
#
# Capacitor discovers plugins and bridges JS<->Java by reflection, so those entry
# points must survive shrinking. Everything else can go.

# --- Capacitor bridge -------------------------------------------------------
-keep public class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.PluginMethod public <methods>;
}
-keep class * extends com.getcapacitor.Plugin { *; }

# Anything reachable from the WebView's JS bridge.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# --- Plugins actually used --------------------------------------------------
-keep class com.capacitorjs.plugins.localnotifications.** { *; }

# --- App entry point --------------------------------------------------------
-keep class com.newgrace.everyday.MainActivity { *; }

# --- Capacitor reads plugin config via Gson/JSON reflection -----------------
-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod
-keepclassmembers,allowobfuscation class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# --- AndroidX / Kotlin ------------------------------------------------------
-dontwarn kotlinx.coroutines.**
-dontwarn org.jetbrains.annotations.**
-dontwarn org.apache.cordova.**

# --- Size + privacy: strip debug logging from release builds ----------------
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Keep line numbers for readable crash reports, but hide the original file name.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
