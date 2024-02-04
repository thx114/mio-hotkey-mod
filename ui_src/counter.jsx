//import React, { useEffect, useCallback, useState } from 'react'
//import { $Panel, $Button } from 'hookui-framework'

if (typeof (window.MIOMOD_SAVE) == 'undefined') { window.MIOMOD_SAVE = {} }
window.MIOMOD_SAVE.mio_hotkey_mod = {
    TrafficLightsSave: {}
}
window.MIOMOD_SAVE.Lock = {}
window.MIOMOD_SAVE.loc = (document.documentElement.classList.value.includes('zh-HANS')) ?'cn':'en'
if (document.getElementById('mioHotkeyMod')) { return }
class RIF {
    static Match(string, replaceMatch, rString) {
        return ((replaceMatch === 'full' && string === rString) || (replaceMatch === 'inc' && string.includes(rString)) || false)
    }
    constructor(input = {}) {
        this.items = [document]
        this.mode = input.mode || 'text'
        this.match = input.match || 'full'
        this.replaceFunctions = input.func || []
        this.fullReplace = input.full || false
    }
    st = (obj) => {
        this.mode = obj.mode || this.mode
        this.match = obj.match || this.match
        this.replaceFunctions = obj.func ? [...this.replaceFunctions, ...obj.func] : this.replaceFunctions
        this.fullReplace = obj.full || this.fullReplace
    }
    get before() {
        this.items = this.items
            .filter(item => item && item.previousElementSibling)
            .map(item => item.previousElementSibling);
        return this
    }
    get next() {
        this.items = this.items
            .filter(item => item && item.nextElementSibling)
            .map(item => item.nextElementSibling);
        return this
    }
    get first() {
        this.items = this.items
            .filter(item => item && item.firstElementChild)
            .map(item => item.firstElementChild);
        return this
    }
    get all() {
        this.items = this.items
            .filter(item => item && item.children && item.children.length)
            .map(item => Array.from(item.children))
            .reduce((acc, children) => acc.concat(children), []);
        return this
    }
    index = (index) => {
        this.items = this.items
            .filter(item => item && item.children && item.children.length)
            .map(item => item.children[index]);
        return this
    }
    haveStyle = (styles) => {
        this.items = this.items
            .filter(item => { try { let style_ = item.getAttribute("style"); return style_ && style_.includes(styles) } catch { return false } });
        return this
    }
    isStyle = (styles) => {
        this.items = this.items
            .filter(item => { try { let style_ = item.getAttribute("style"); return style_ && (style_ === styles) } catch { return false } });
        return this
    }
    isClass = (ClassList) => {
        this.items = this.items
            .filter(item => item && item.classList === ClassList);
        return this
    }
    isId = (Id) => {
        this.items = this.items
            .filter(item => item && item.id === Id);
        return this
    }
    class = (className) => {
        this.items = this.items
            .filter(item => (item))
            .map(item => Array.from(item.querySelectorAll(`.${className}`)))
            .reduce((acc, children) => acc.concat(children), []);
        return this
    }
    id = (idValue) => {
        this.items = this.items
            .filter(item => (item))
            .map(item => Array.from(item.querySelectorAll(`#${idValue}`)))
            .reduce((acc, children) => acc.concat(children), []);
        return this
    }
    hasHtml = (html) => {
        if (html === '*') { return this }

        this.items = this.items
            .filter(item => (item.innerHTML.includes(html)))
        return this
    }
    isHtml = (html) => {
        this.items = this.items
            .filter(item => (item.innerHTML === html))
        return this
    }
    get fontCN() {
        this.replaceFunctions.push((div) => {
            div.style.fontFamily = "Noto Sans SC"
        })
        return this
    }


    REPLACE = (replaceObject) => {
        let mode = (
            (this.mode === 'html') ? 'innerHTML' :
                (this.mode === 'text') ? 'textContent' :
                    'error'
        )
        if (mode == 'error') { console.log('mode错误:', this.mode) }

        for (const [key, value] of Object.entries(replaceObject)) {
            this.items.forEach(item => {
                if (item && RIF.Match(item[mode], this.match, key)) {
                    if (this.match === 'full') {
                        item[mode] = value
                    } else if (this.match === 'inc') {
                        if (this.fullReplace) { item[mode] = value } else {
                            item[mode] = item[mode].replace(new RegExp(`${key}`, 'g'), value)
                        }
                    }
                    this.replaceFunctions.forEach(func => func(item))
                    window.__LOGGING__ += 1
                }
            })
        }
    }
    get click() {
        this.items.forEach(item => {
            const allProps = Object.keys(item);
            for (const prop of allProps) {
                if (prop.startsWith('__reactProps')) {
                    try { item[prop].onClick() } catch { }
                }
            }
        })
    }
    get enable() {
        this.items = this.items.forEach(item => {
            if (!(item.classList.contains(this.STATE))) { this.click }
        })
        return this
    }
    get disable() {
        this.items = this.items.forEach(item => {
            if (item.classList.contains(this.STATE)) { this.click }
        })
        return this
    }
    state = (STATE) => {
        this.STATE = STATE
        return this
    }
    get q() {
        const self = this
        return {
            to: (html) => {
                return {
                    get select() {
                        return self.class('button_KVN.button_KVN.multi-select_Roq').hasHtml(html).state('selected');
                    },
                    get CGE_chicked() {
                        return self.class('title_vqR').hasHtml(html).before.class('toggle_cca.item-mouse-states_Fmi.toggle_CGE').state('checked')
                    },
                    CGE_value: (value) => {
                        self.class('title_vqR').hasHtml(html).next.class('input_JvC.item-states_QjV')
                        self.items = self.items.forEach(item => {
                            item.value = value
                        })
                        return self
                    },
                    get obj() {
                        self.class('editor-item_VnW.editor-item-base_sYx.editor-widget_QQl').first.first.isHtml(html).next.state('checked')
                        return self
                    },
                    get clear() {
                        return self.class('button_WPv.button_dLA').hasHtml(html)
                    },
                    get picker() {
                        return self.class('picker-toggle_d6k')
                    }
                };
            }
        };
    }
}
function rif(...args) { return new RIF(...args) }
function RE(...args) {
    return args.reduce((result, value, index, array) => {
        if (index % 2 === 0) {
            const key = array[index];
            const val = array[index + 1];
            result.set(key, val);
        }
        return result;
    }, new Map());
}
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function click(ITEM) {
    try {
        const allProps = Object.keys(ITEM);
        for (const prop of allProps) {
            if (prop.startsWith('__reactProps')) {
                try { ITEM[prop].onClick() } catch { }
            }
        }
    } catch { }
}
async function Lock(name,time) {
    async function _Lock(name, time = 0) {
        if (typeof (window.MIOMOD_SAVE.Lock[name]) == 'undefined') { window.MIOMOD_SAVE.Lock[name] = false }
        if ((!window.MIOMOD_SAVE.Lock[name]) && time === 0) { window.MIOMOD_SAVE.Lock[name] = true; return true }
        else if (window.MIOMOD_SAVE.Lock[name] && time > 0) { await delay(time); window.MIOMOD_SAVE.Lock[name] = false }
        else { return false }
    }
    if (await _Lock(name)) { _Lock(name, time); return true }
    else { return false }

}
class Alignment {
    static Loc = window.MIOMOD_SAVE.loc == 'cn' ?
        '<p>shift + 1 : 无碎格铺路</p> <p>shift + 2 : 曲线拉大路口</p>' :
        '<p>shift + 1 : Build roads without grid</p> <p>shift + 2 : Expand intersection with curves</p>'
    static Buttons = {
        get ExistingGeometry() { return rif().q.to('ExistingGeometry').select },
        get ObjectSide() { return rif().q.to('ObjectSide').select },
        get GuideLines() { return rif().q.to('GuideLines').select },
        get CellLength() { return rif().q.to('CellLength').select },
        get StraightDirection() { return rif().q.to('StraightDirection').select },
        get ZoneGrid() { return rif().q.to('ZoneGrid').select },
    }
    static Hotkeys = RE(
        ['shift', 'Digit1'], async () => {
            Alignment.Buttons.ExistingGeometry.disable; await delay(50);
            Alignment.Buttons.ObjectSide.disable; await delay(50);
            Alignment.Buttons.GuideLines.disable; await delay(50);

            Alignment.Buttons.CellLength.enable; await delay(50);
            Alignment.Buttons.StraightDirection.enable; await delay(50);
            Alignment.Buttons.ZoneGrid.enable; await delay(50);
        },
        ['shift', 'Digit2'], async () => {
            Alignment.Buttons.ZoneGrid.disable; await delay(50);
            Alignment.Buttons.GuideLines.disable; await delay(50);
            Alignment.Buttons.ExistingGeometry.click; await delay(50);

            Alignment.Buttons.ObjectSide.disable; await delay(50);
            Alignment.Buttons.CellLength.disable; await delay(50);
            Alignment.Buttons.StraightDirection.enable; await delay(50);
        },
        ['shift', 'ShiftLeft'], async () => {
            if (rif().class('button_KVN.button_KVN.multi-select_Roq').hasHtml('ZoneGrid').items.length) {
                InfoP.Update(Alignment.Loc,
                    {
                        fontFamily: "Noto Sans SC",
                        fontWeight: 'bold',
                        textShadow: '1.000000rem 1.000000rem 5.000000rem rgba(0, 0, 0, 1.000000)',
                        fontSize: '20.000000rem',
                        justifyContent: 'flex-start'
                    }
                )
            }
        }
    )
}
class HomeMenu {
    static add(pickerToPick) {
        return async () => {
            
            HomeMenu.Buttons.picker.pickerButton.click
            await delay(40);
            HomeMenu.Buttons.picker.clearAllPicker.click
            await delay(40);
            let list = pickerToPick.includes(',') ? pickerToPick.split(',') : [pickerToPick];
            for (item of list) {
                rif().q.to(item).obj.enable
                await delay(40);
            }
            await delay(40);
            HomeMenu.Buttons.picker.pickerButton.click
        }
    }
    static Loc = window.MIOMOD_SAVE.loc == 'cn' ?
        '<p>shift + Num1 : 地面</p> <p>shift + Num2 : 道路</p> <p>shift + Num3 : 标志性<p> <p>shift + Num4 : 水源,位置,动物</p> <p>shift + Num5 : 灯光</p> <p>shift + Num6 : 公交站牌</p> <p>shift + Num7 : 道路标志</p><p>shift + Num8 : 道路升级</p><p>shift + Num9 : 小物件</p>' :
        '<p>shift + Num1 : Surface</p> <p>shift + Num2 : Bridges and Roads</p> <p>shift + Num3 : signature building<p> <p>shift + Num4 : Water Sources, Locations, Animals</p> <p>shift + Num5 : Lights</p> <p>shift + Num6 : Signs</p> <p>shift + Num7 : Road Symbols and Traffic Lights</p><p>shift + Num8 : Road Upgrades</p><p>shift + Num9 : Small Objects</p>'
    static Buttons = {
        picker: {
            get pickerButton() { return rif().q.to().picker },
            get clearAllPicker() { return rif().q.to('清除全部').clear },
        },
    }
    static Hotkeys = RE(
            ['shift', 'NumPad1'], HomeMenu.add('surface'),
            ['shift', 'NumPad2'], HomeMenu.add('bridge,net'),
            ['shift', 'NumPad3'], HomeMenu.add('signaturebuilding'),
            ['shift', 'NumPad4'], HomeMenu.add('spawnlocation,takeofflocation,watersource,creaturespawner'),
            ['shift', 'NumPad5'], HomeMenu.add('streetlightobject'),
            ['shift', 'NumPad6'], HomeMenu.add('transportstop'),
            ['shift', 'NumPad7'], HomeMenu.add('trafficlightobject,trafficsignobject'),
            ['shift', 'NumPad8'], HomeMenu.add('netupgrade'),
            ['shift', 'NumPad9'], HomeMenu.add('subobjectdefaultprobability'),
            ['shift', 'ShiftLeft'], async () => {
                if (rif().class('picker-toggle_d6k').items.length) {
                    InfoP.Update(HomeMenu.Loc,
                    {
                        fontFamily: "Noto Sans SC",
                        fontWeight: 'bold',
                        textShadow: '1.000000rem 1.000000rem 5.000000rem rgba(0, 0, 0, 1.000000)',
                        fontSize: '20.000000rem',
                        justifyContent: 'flex-start'
                    }
                )
            }
            }
        )
}
class TrafficLights {
    static getTrafficLightsNow() {
        let panel = []
        for (const line of TrafficLights.Buttons.LineButton.items) {
            let Line = []
            for (const sign of line.querySelectorAll('.traffic-sign-button__Button-c2vm-tle__sc-1b2zrmw-0')) {
                Line.push((sign.style.opacity === '1.000000'))
            }
            panel.push(Line)
        }
        return panel
    }
    static getTrafficLightsItems() {
        let panel = []
        for (const line of TrafficLights.Buttons.LineButton.items) {
            let Line = []
            for (const sign of line.querySelectorAll('.traffic-sign-button__Button-c2vm-tle__sc-1b2zrmw-0')) {
                Line.push(sign)
            }
            panel.push(Line)
        }
        return panel
    }
    static load(key) {
        TrafficLights.Buttons.activeLineButton.click
        let loadPanel = window.MIOMOD_SAVE.mio_hotkey_mod.TrafficLightsSave['_' + key]
        if (!loadPanel || loadPanel.length === 0) { return }
        let Items = TrafficLights.getTrafficLightsItems()
        Items.forEach((line, lineIndex) => {
            line.forEach((sign, signIndex) => {
                if (loadPanel[lineIndex][signIndex]) {
                    click(sign)
                }
            })
        })
    }
    static save(key) {
        let data = TrafficLights.getTrafficLightsNow()
        if (data.length) {
            window.MIOMOD_SAVE.mio_hotkey_mod.TrafficLightsSave['_' + key] = data
        }
    }

    static Buttons = {
        get activeLineButton() { return rif().class('traffic-sign-button__Button-c2vm-tle__sc-1b2zrmw-0').haveStyle('opacity: 1.000000;') },
        get LineButton() { return rif().class('lane__Container-c2vm-tle__sc-vpfjbn-0.emcyeO') }
    }
    static Hotkeys = RE(
        ['shift', 'Digit1'], async () => { TrafficLights.save(1) },
        ['Digit1'], async () => { TrafficLights.load(1) },

        ['shift', 'Digit2'], async () => { TrafficLights.save(2) },
        ['Digit2'], async () => { TrafficLights.load(2) },

        ['shift', 'Digit3'], async () => { TrafficLights.save(3) }, 
        ['Digit3'], async () => { TrafficLights.load(3) },

        ['shift', 'Digit4'], async () => { TrafficLights.save(4) }, 
        ['Digit4'], async () => { TrafficLights.load(4) },

        ['shift', 'Digit5'], async () => { TrafficLights.save(5) }, 
        ['Digit5'], async () => { TrafficLights.load(5) },

        ['shift', 'Digit6'], async () => { TrafficLights.save(6) }, 
        ['Digit6'], async () => { TrafficLights.load(6) },

        ['shift', 'Digit7'], async () => { TrafficLights.save(7) }, 
        ['Digit7'], async () => { TrafficLights.load(7) },

        ['shift', 'Digit8'], async () => { TrafficLights.save(8) }, 
        ['Digit8'], async () => { TrafficLights.load(8) },

        ['shift', 'Digit9'], async () => { TrafficLights.save(9) }, 
        ['Digit9'], async () => { TrafficLights.load(9) },
    )
}
class InfomodesPanel {
    static getPanelItems() {
        return rif().class('infomodes-panel_B0O')
    }
    static getItemState(index) {
        return InfomodesPanel.getPanelItems().index(index).items[0].classList.contains('active_m64')
    }
    static clickAllItems(...ButtonIndexList) {
        for (item of [...ButtonIndexList]) {
            InfomodesPanel.getPanelItems().index(item).click
        }
    }
    static clear() {
        rif().class('infomode-item_K8b.active_m64').click
    }
    static getActiveItemNum() {
        return rif().class('infomode-item_K8b.active_m64').items.length
    }
    static toolAtv(svgName){ 
        return async () => { 
            return ( 
                rif().class('tool-main-column_PaC').items.length > 0 && 
                rif().class('button_Yym.selected').hasHtml(svgName).items.length > 0 && 
                rif().class('active-infoview-panel_aTq').items.length > 0)
        } 
    }

    static ClickFuncs = RE(
        [InfomodesPanel.toolAtv('Bus.svg')],
        async () => {
            if (InfomodesPanel.getActiveItemNum() === 3 && InfomodesPanel.getItemState(5)) return;
            InfomodesPanel.clear(); await delay(50);
            InfomodesPanel.clickAllItems(5, 15, 14)
        },

        [InfomodesPanel.toolAtv('Train.svg')],
        async () => {
            if (InfomodesPanel.getActiveItemNum() === 3 && InfomodesPanel.getItemState(6)) return;
            InfomodesPanel.clear(); await delay(50);
            InfomodesPanel.clickAllItems(6, 16, 14)
        },

        [InfomodesPanel.toolAtv('Tram.svg')],
        async () => {
            if (InfomodesPanel.getActiveItemNum() === 3 && InfomodesPanel.getItemState(7)) return;
            InfomodesPanel.clear(); await delay(50);
            InfomodesPanel.clickAllItems(7, 17, 14)
        },

        [InfomodesPanel.toolAtv('Subway.svg')],
        async () => {
            if (InfomodesPanel.getActiveItemNum() === 3 && InfomodesPanel.getItemState(8)) return;
            InfomodesPanel.clear(); await delay(50);
            InfomodesPanel.clickAllItems(8, 18, 14)
        },

        [InfomodesPanel.toolAtv('Ship.svg')],
        async () => {
            if (InfomodesPanel.getActiveItemNum() === 3 && InfomodesPanel.getItemState(9)) return;
            InfomodesPanel.clear(); await delay(50);
            InfomodesPanel.clickAllItems(9, 19, 14)
        },

        [InfomodesPanel.toolAtv('Airplane.svg')],
        async () => {
            if (InfomodesPanel.getActiveItemNum() === 2 && InfomodesPanel.getItemState(10)) return;
            InfomodesPanel.clear(); await delay(50);
            InfomodesPanel.clickAllItems(10, 14)
        },

    )
}
class SmartClosePanel {
    static getpanelList() {
        return [
            rif().class('panel__Container-c2vm-tle__sc-1et6j5f-0').class('button__ButtonComponent-c2vm-tle__sc-u09bwf-0'),
            (() => {
                let item = rif().class('main-panel__Container-c2vm-tle__sc-1bltd-0').class('row__Container-c2vm-tle__sc-10rns0c-0').hasHtml('button__ButtonComponent-c2vm-tle__sc-u09bwf-0')
                item.items = [item.items[2]]
                return item
            })() 
        ] 
    } 

    static panelList = SmartClosePanel.getpanelList()
}
class PloppableRICO {
    static OverFuncs = [
        function assetPageIndicators(item){
            if ((item.classList.contains('item-inner_hCN') || item.classList.contains('row_nrc')) && rif().class('page-indicators_Z3v').items.length > 0) {
                window.MIOMOD_SAVE.global.cKeys.over_pageIndicators = true
            } else { window.MIOMOD_SAVE.global.cKeys.over_pageIndicators = false }
        },
        function assetCategoryTab(item){
            if ((item.classList.contains('item-inner_NKx') || item.classList.contains('asset-category-tab-bar_IGA')) && rif().class('button_Yym.button_Yym').items.length > 0) {
                window.MIOMOD_SAVE.global.cKeys.over_button_Yym_page = true
            } else { window.MIOMOD_SAVE.global.cKeys.over_button_Yym_page = false }
        }
    ]
    static WheelFuncs = [
        function assetPageIndicators(d){
            try {
                if (d === 'up' && window.MIOMOD_SAVE.global.cKeys.over_pageIndicators) {
                    rif().class('page-indicator_zOa.selected').before.click
                } else if (d === 'down' && window.MIOMOD_SAVE.global.cKeys.over_pageIndicators) {
                    rif().class('page-indicator_zOa.selected').next.click
                }
            } catch{}
        },
        function assetCategoryTab(d){
            try {
                if (d === 'up' && window.MIOMOD_SAVE.global.cKeys.over_button_Yym_page) {
                    rif().class('button_Yym.selected.button_Yym').before.click
                } else if (d === 'down' && window.MIOMOD_SAVE.global.cKeys.over_button_Yym_page) {
                    rif().class('button_Yym.selected.button_Yym').next.click
                }
            } catch { }
        }

    ]
}
class InfoP {
    static Update(infoText, style = Object({ fontFamily : "Noto Sans SC" })) {
        if (!document.getElementById('infop') && rif().class('fps-display_t30').items.length > 0) {
            let infoDiv = document.createElement("div")
            infoDiv.innerHTML = infoText
            infoDiv.id = 'infop'
            infoDiv.style.fontFamily = "Noto Sans SC"
            infoDiv.children.forEach(a => {
                for (const [ObjName, value] of Object.entries(style)) {
                    a.style[ObjName] = value
                }
            })


            rif().class('fps-display_t30').items[0].appendChild(infoDiv);
        } else if (document.getElementById('infop')) {




            if (document.getElementById('infop').innerHTML.includes(infoText.split('>')[1])) { return }
            document.getElementById('infop').innerHTML += infoText
            document.getElementById('infop').children.forEach(a => {
                for (const [ObjName, value] of Object.entries(style)) {
                    a.style[ObjName] = value
                }
    })

}
    }


}
class overDebug {
    static Hotkeys = RE(
        ['shift', 'alt', 'KeyZ'], async () => {
            if (!await Lock('saz',200)) {return }
            console.log(window.MIOMOD_SAVE.global.lastGreenedItem, window.MIOMOD_SAVE.global.lastGreenedItem.textContent)
        },
        ['shift', 'alt', 'NumPad1'], async () => {
            if (!await Lock('sanp1', 200)) { return }
            console.log(
                rif().class('asset-detail-panel_hf8.detail-panel_izf').class('title-bar_I7O.child-opacity-transition_nkS').class('title_qub').items[0].textContent,
                rif().class('asset-detail-panel_hf8.detail-panel_izf').class('content_rep.row_H0d.child-opacity-transition_nkS').class('column_dTT').class('paragraphs_nbD.description_ZQn').first.items[0].textContent
            )
        },
        ['shift', 'alt', 'NumPad2'], async () => {
            if (!await Lock('sanp2', 200)) { return }
            console.log(
                rif().class('balloon_qJY.balloon_H23.up_ehW.center_hug.anchored-balloon_AYp.up_el0').class('title_lCJ').items[0].textContent,
                rif().class('balloon_qJY.balloon_H23.up_ehW.center_hug.anchored-balloon_AYp.up_el0').class('paragraphs_nbD.description_dNa').first.items[0].textContent
            )
    },
        ['shift', 'alt', 'NumPad3'], async () => {
            if (!await Lock('sanp3', 200)) { return }
            console.log(
                rif().class('option-page_CW8.option-section_VzQ').class('info-column_uQ0').class('info-description_wwd').items[0].textContent
            )
            
    },
        ['shift', 'alt', 'NumPad4'], async () => {
            if (!await Lock('sanp4', 200)) { return }
            rif().class('value_uLz').items.forEach(i => { console.log(i.textContent )})

        }
    )
}
try {
    if (!document.getElementById('mioHotkeyMod')) {
        if (!window.MIOMOD_SAVE.global) window.MIOMOD_SAVE.global = {};
        if (!window.MIOMOD_SAVE.global.cKeys) window.MIOMOD_SAVE.global.cKeys = {};

        // Add All Hotekys and ClickEvent
        let HOTKEYS_ITEMS = {}
        let CLICK_ITEMS = {}
        let CLICK2_ITEMS = function () { }
        let OVER_ITEMS = []
        let WHEEL_ITEMS = []

        const HotkeyFuncs = [Alignment, HomeMenu, TrafficLights, overDebug]
        const ClickFuncs = [InfomodesPanel]
        const OverFuncs = [PloppableRICO]
        const WheelFuncs = [PloppableRICO]

        HotkeyFuncs.forEach((item, index) => { HOTKEYS_ITEMS[index] = item.Hotkeys })
        ClickFuncs.forEach((item, index) => { CLICK_ITEMS[index] = item.ClickFuncs })
        OverFuncs.forEach(item => { OVER_ITEMS = [...OVER_ITEMS, ...item.OverFuncs] })
        WheelFuncs.forEach(item => { WHEEL_ITEMS = [...WHEEL_ITEMS, ...item.WheelFuncs] })
        CLICK2_ITEMS = SmartClosePanel.getpanelList

        console.log('MioHotkeys - All hotkeys and event Loaded:', LE = [HOTKEYS_ITEMS, CLICK_ITEMS, CLICK2_ITEMS, OVER_ITEMS, WHEEL_ITEMS], (() => { if (LE[0] && LE[1] && LE[2])return 'Succ'})())

        window.MIOMOD_SAVE.mio_hotkey_mod.Event = { 
            // KeyEvent
            keydown: async (event) => {
                for (const [ObjName, ObjReItems] of Object.entries(HOTKEYS_ITEMS)) {
                    for (const [Keys, Func] of ObjReItems) {
                        if (
                            ((Keys.includes('shift')) ? event.shiftKey : !event.shiftKey) &&
                            ((Keys.includes('alt')) ? event.altKey : !event.altKey) &&
                            ((Keys.includes('ctrl')) ? event.ctrlKey : !event.ctrlKey) &&
                            (Keys.includes(event.code))
                        ) { await Func()}
                    }
                }
                if (window.MIOMOD_SAVE.global) {
                    window.MIOMOD_SAVE.global.keys = {
                        shift: event.shiftKey,
                        alt: event.altKey,
                        ctrl: event.ctrlKey,
                        key: event.code,
                    }
                } else {
                    window.MIOMOD_SAVE.global = {}
                }
            },
            keyup: async (event) => {
                if (window.MIOMOD_SAVE.global) {
                    window.MIOMOD_SAVE.global.keys = {
                        shift: event.shiftKey,
                        alt: event.altKey,
                        ctrl: event.ctrlKey,
                        key: false,
                    }

                    // clear MouseOver.lightgreenBG
                    if (!(window.MIOMOD_SAVE.global.keys.shift && window.MIOMOD_SAVE.global.keys.alt) && (window.MIOMOD_SAVE.global && window.MIOMOD_SAVE.global.lastGreenedItem)) {
                        window.MIOMOD_SAVE.global.lastGreenedItem.style.backgroundColor = window.MIOMOD_SAVE.global.lastGreenedItembackgroundColor || ''
                    }

                } else {
                    window.MIOMOD_SAVE.global = {}
                }
            },

            // isMouseMoveCheck
            mousedown: async (event) =>{
                if (window.MIOMOD_SAVE.global) {
                    let { x, y } = window.MIOMOD_SAVE.global
                    if (x === event.clientX && y === event.clientY) { window.MIOMOD_SAVE.global.move = false }
                    else { window.MIOMOD_SAVE.global.move = true }
                } else {
                    window.MIOMOD_SAVE.global = {}
                }

                window.MIOMOD_SAVE.global.x = event.clientX
                window.MIOMOD_SAVE.global.y = event.clientY
            },

            // MouseClickEvent
            click: async (event) => {
                if (event.button === 0) {
                    for (const [ObjName, ObjReItems] of Object.entries(CLICK_ITEMS)) {
                        for (const [Keys, Func] of ObjReItems) {
                            if (await Keys[0]()) { await Func() }
                        }
                    }
                    let currentTime = new Date().getTime();
                    if (currentTime - window.MIOMOD_SAVE.mio_hotkey_mod.lastClickTime < 400 && window.MIOMOD_SAVE.global.move === false) {
                        for (item of CLICK2_ITEMS()) {
                            if (item.items.length > 0) { try { item.click } catch { }; break }
                        }
                    }
                    window.MIOMOD_SAVE.mio_hotkey_mod.lastClickTime = currentTime;
                }
            },

            // MouseOverEvent
            mouseover: async (event) => {
                let hoveredElement = event.target
                if (window.MIOMOD_SAVE.global) {
                    window.MIOMOD_SAVE.global.over = hoveredElement
                } else {
                    window.MIOMOD_SAVE.global = {}
                }

                // LOAD AND RUN OVER_ITEMS
                for (item of OVER_ITEMS) { item(hoveredElement) }
                

                // OVER lightgreenBG
                if (window.MIOMOD_SAVE.global && window.MIOMOD_SAVE.global.keys && window.MIOMOD_SAVE.global.keys.shift && window.MIOMOD_SAVE.global.keys.alt) {
                    let backgroundColor
                    if (hoveredElement.style.backgroundColor) {
                        backgroundColor = hoveredElement.style.backgroundColor
                    }
                    if (!hoveredElement.classList.contains('style--default')) {

                        hoveredElement.style.backgroundColor = 'lightgreen';

                        let Loc = window.MIOMOD_SAVE.loc == 'cn' ?
                            '<p>shift + alt + z : 输出元素</p> <p>shift + alt + Num1 : 输出资产信息</p><p>shift + alt + Num2 : 输出悬浮框</p><p>shift + alt + Num3 : 输出设置详情</p><p>shift + alt + Num4 : 输出鼠标悬浮框</p>' :
                            '<p>shift + alt + z : Output the DOM element under the mouse cursor</p> <p>shift + alt + Num1 : Output Asset Information</p><p>shift + alt + Num2 : Output Tooltip</p><p>shift + alt + Num3 : Output Settings Details</p><p>shift + alt + Num4 : Output Mouse Hover Box</p>'

                        InfoP.Update(Loc,
                            {
                                fontFamily : "Noto Sans SC",
                                fontWeight : 'bold',
                                textShadow: '1.000000rem 1.000000rem 5.000000rem rgba(0, 0, 0, 1.000000)',
                                fontSize: '20.000000rem',
                                justifyContent: 'flex-start'
                            }
                        )
                        
                        hoveredElement.addEventListener('mouseout', function () {
                            hoveredElement.style.backgroundColor = backgroundColor || '';
                        }, { once: true });
                        window.MIOMOD_SAVE.global.lastGreenedItem = hoveredElement
                        window.MIOMOD_SAVE.global.lastGreenedItembackgroundColor = backgroundColor
                    }


                }
                else if (document.getElementById('infop')) { document.getElementById('infop').innerHTML = ''}
            },

            // WheelEvent
            wheel: async (event) => {
                const delta = event.deltaY > 0 ? 'down' : event.deltaY < 0 ? 'up' : 'none'
                if (delta === 'none') return;
                for (item of WHEEL_ITEMS) { item(delta) }
            }
        }

        for ([key, value] of Object.entries(window.MIOMOD_SAVE.mio_hotkey_mod.Event)) {
            document.addEventListener(key, value)
        }


        // js Load fix
        mioHotkeyDiv = document.createElement('div')
        mioHotkeyDiv.id = 'mioHotkeyMod'
        document.head.appendChild(mioHotkeyDiv)

        window.mioHotkeyDiv.functions = {
            RELOAD: (EVENT) => {
                console.log('EVENT:', window.MIOMOD_SAVE.mio_hotkey_mod.Event);
                for ([key, value] of Object.entries(window.MIOMOD_SAVE.mio_hotkey_mod.Event)) {
                    document.removeEventListener(key, value)
                }
                console.log('EVENT:', EVENT);
                window.MIOMOD_SAVE.mio_hotkey_mod.Event = EVENT
                for ([key, value] of Object.entries(window.MIOMOD_SAVE.mio_hotkey_mod.Event)) {
                    document.addEventListener(key, value)
                }

            }
        }
    }

} catch { }