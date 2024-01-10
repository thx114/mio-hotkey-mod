using BepInEx;
using HarmonyLib;
using HookUILib.Core;


#if BEPINEX_V6
    using BepInEx.Unity.Mono;
#endif
public static class mioPLUGIN
{
    public const string PLUGIN_GUID = "mio-hotkey-mod";
    public const string PLUGIN_NAME = "MioHotkeyMod";
    public const string PLUGIN_VERSION = "0.0.8";
}
namespace MioHotkeyMod
{
    [BepInPlugin(mioPLUGIN.PLUGIN_GUID, mioPLUGIN.PLUGIN_NAME, mioPLUGIN.PLUGIN_VERSION)]
    public class Plugin : BaseUnityPlugin {
        private void Awake() {

            var harmony = new Harmony(mioPLUGIN.PLUGIN_NAME);

            harmony.PatchAll();
            Logger.LogInfo($"Plugin {mioPLUGIN.PLUGIN_GUID} is loaded!");

        }
    }
    public class PluginUI : UIExtension {
        public new readonly string extensionID = "mio.hotkey";
        public new readonly string extensionContent;
        public new readonly ExtensionType extensionType = ExtensionType.Panel;

        public PluginUI() {
            this.extensionContent = this.LoadEmbeddedResource("MioHotkeyMod.dist.bundle.js");
        }
    }
}

