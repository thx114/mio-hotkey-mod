using BepInEx;
using HarmonyLib;
using HookUILib.Core;


#if BEPINEX_V6
    using BepInEx.Unity.Mono;
#endif
public static class mioPLUGIN
{
    public const string PLUGIN_GUID = "mio-i18n-cn";
    public const string PLUGIN_NAME = "I18nCN";
    public const string PLUGIN_VERSION = "1.2.9";
}
namespace I18nCN
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
        public new readonly string extensionID = "mio.I18nCN";
        public new readonly string extensionContent;
        public new readonly ExtensionType extensionType = ExtensionType.Panel;

        public PluginUI() {
            this.extensionContent = this.LoadEmbeddedResource("I18nCN.dist.bundle.js");
        }
    }
}

