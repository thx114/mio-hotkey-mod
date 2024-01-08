import React, { useEffect ,useCallback, useState } from 'react'
import { $Panel, $Button } from 'hookui-framework'

if (typeof (window.MIOMOD_SAVE) == 'undefined') { window.MIOMOD_SAVE = {} }
window.MIOMOD_SAVE.mio_hotkey_mod = {
    TrafficLightsSave: {}
}
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

try {
    const 按钮 = {
        对齐: {
            get 物件() { return rif().q.to('ExistingGeometry').select },
            get 建筑物两侧() { return rif().q.to('ObjectSide').select },
            get 导线() { return rif().q.to('GuideLines').select },

            get 单元格() { return rif().q.to('CellLength').select },
            get 直角() { return rif().q.to('StraightDirection').select },
            get 功能区() { return rif().q.to('ZoneGrid').select },


        },
        DEV: {
            分类: {
                get 过滤器() { return rif().q.to().picker },
                get 清除全部() { return rif().q.to('清除全部').clear },

            },
            add(分类) {
                return async () => {
                    按钮.DEV.分类.过滤器.click
                    await delay(40);
                    按钮.DEV.分类.清除全部.click
                    await delay(40);
                    let list = 分类.includes(',') ? 分类.split(',') : [分类];
                    for (item of list) {
                        rif().q.to(item).obj.enable
                        await delay(40);
                    }
                    await delay(40);
                    按钮.DEV.分类.过滤器.click
                }


            }

        },
        交通信号灯改善: {
            get 车道保存() { return rif().class('button__ButtonComponent-c2vm-tle__sc-u09bwf-0') }
        }
    }


    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function click(ITEM) {
        const allProps = Object.keys(ITEM);
        for (const prop of allProps) {
            if (prop.startsWith('__reactProps')) {
                try { ITEM[prop].onClick() } catch { }
            }
        }
    }

    class TrafficLights {
        static getTrafficLightsNow() {
            let panel = []
            for (const line of rif().class('lane__Container-c2vm-tle__sc-vpfjbn-0.emcyeO').items) {
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
            for (const line of rif().class('lane__Container-c2vm-tle__sc-vpfjbn-0.emcyeO').items) {
                let Line = []
                for (const sign of line.querySelectorAll('.traffic-sign-button__Button-c2vm-tle__sc-1b2zrmw-0')) {
                    Line.push(sign)
                }
                panel.push(Line)
            }
            return panel
        }
        static load(key) {
            rif().class('traffic-sign-button__Button-c2vm-tle__sc-1b2zrmw-0').haveStyle('opacity: 1.000000;').click
            let loadPanel = window.MIOMOD_SAVE.mio_hotkey_mod.TrafficLightsSave['_' + key]
            if (!loadPanel || loadPanel.length === 0) {return }
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

    }

    HOTKEYS_ITEMS = {
        完美道路: RE(
            ['shift', 'Digit1'], async () => {
                按钮.对齐.物件.disable; await delay(50);
                按钮.对齐.建筑物两侧.disable; await delay(50);
                按钮.对齐.导线.disable; await delay(50);

                按钮.对齐.单元格.enable; await delay(50);
                按钮.对齐.直角.enable; await delay(50);
                按钮.对齐.功能区.enable; await delay(50);
            }
        ),
        曲线大路口: RE(
            ['shift', 'Digit2'], async () => {
                按钮.对齐.功能区.disable; await delay(50);
                按钮.对齐.导线.disable; await delay(50);
                按钮.对齐.物件.click; await delay(50);

                按钮.对齐.建筑物两侧.disable; await delay(50);
                按钮.对齐.单元格.disable; await delay(50);
                按钮.对齐.直角.enable; await delay(50);
            }
        ),
        开发者模式_分类: RE(
            ['shift', 'NumPad1'], 按钮.DEV.add('surface'),
            ['shift', 'NumPad2'], 按钮.DEV.add('bridge,net'),
            ['shift', 'NumPad3'], 按钮.DEV.add('signaturebuilding'),
            ['shift', 'NumPad4'], 按钮.DEV.add('spawnlocation,takeofflocation,watersource,creaturespawner'),
            ['shift', 'NumPad5'], 按钮.DEV.add('streetlightobject'),
            ['shift', 'NumPad6'], 按钮.DEV.add('transportstop'),
            ['shift', 'NumPad7'], 按钮.DEV.add('trafficlightobject,trafficsignobject'),
            ['shift', 'NumPad8'], 按钮.DEV.add('netupgrade'),
            ['shift', 'NumPad9'], 按钮.DEV.add('subobjectdefaultprobability'),
        ),
        交通信号灯改善: RE(
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
        )

    }
    const CLICK_EMT = {
        toolAtv: (svgName) => {
            return async () => {
                return (
                    rif().class('tool-main-column_PaC').items.length > 0 &&
                    rif().class('button_Yym.selected').hasHtml(svgName).items.length > 0 &&
                    rif().class('active-infoview-panel_aTq').items.length > 0)
            }
        },

    }
    CLICK_ITEMS = {
        公交面板增强: RE(
            [CLICK_EMT.toolAtv('Bus.svg')],
            async () => {
                rif().class('infomode-item_K8b.active_m64').click; await delay(50);
                rif().class('infomode-item_K8b').hasHtml('道路').click
                rif().class('infomode-item_K8b').hasHtml('公交站').click
                rif().class('infomode-item_K8b').hasHtml('交通路线').click
            },

            [CLICK_EMT.toolAtv('Train.svg')],
            async () => {
                rif().class('infomode-item_K8b.active_m64').click; await delay(50);
                rif().class('infomode-item_K8b').hasHtml('火车轨道').click
                rif().class('infomode-item_K8b').hasHtml('火车站').click
                rif().class('infomode-item_K8b').hasHtml('交通路线').click
            },

            [CLICK_EMT.toolAtv('Tram.svg')],
            async () => {
                rif().class('infomode-item_K8b.active_m64').click; await delay(50);
                rif().class('infomode-item_K8b').hasHtml('有轨电车轨道').click
                rif().class('infomode-item_K8b').hasHtml('有轨电车站').click
                rif().class('infomode-item_K8b').hasHtml('交通路线').click
            },

            [CLICK_EMT.toolAtv('Subway.svg')],
            async () => {
                rif().class('infomode-item_K8b.active_m64').click; await delay(50);
                rif().class('infomode-item_K8b').hasHtml('地铁轨道').click
                rif().class('infomode-item_K8b').hasHtml('地铁站').click
                rif().class('infomode-item_K8b').hasHtml('交通路线').click
            },

            [CLICK_EMT.toolAtv('Ship.svg')],
            async () => {
                rif().class('infomode-item_K8b.active_m64').click; await delay(50);
                rif().class('infomode-item_K8b').hasHtml('航道').click
                rif().class('infomode-item_K8b').hasHtml('码头').click
                rif().class('infomode-item_K8b').hasHtml('交通路线').click
            },

            [CLICK_EMT.toolAtv('Airplane.svg')],
            async () => {
                rif().class('infomode-item_K8b.active_m64').click; await delay(50);
                rif().class('infomode-item_K8b').hasHtml('航站楼').click
                rif().class('infomode-item_K8b').hasHtml('交通路线').click
            },

        )
    }
    CLICK2_ITEMS = () => {
        return [
            rif().class('panel__Container-c2vm-tle__sc-1et6j5f-0').class('button__ButtonComponent-c2vm-tle__sc-u09bwf-0'),
            rif().class('main-panel__Container-c2vm-tle__sc-1bltd-0').class('row__Container-c2vm-tle__sc-10rns0c-0').hasHtml('保存')

        ]
    }
    document.addEventListener('keydown', async (event) => {
        for (const [ObjName, ObjReItems] of Object.entries(HOTKEYS_ITEMS)) {
            for (const [Keys, Func] of ObjReItems) {
                if (
                    ((Keys.includes('shift')) ? event.shiftKey : !event.shiftKey) &&
                    ((Keys.includes('alt')) ? event.altKey : !event.altKey) &&
                    ((Keys.includes('ctrl')) ? event.ctrlKey : !event.ctrlKey) &&
                    (Keys.includes(event.code))
                ) {
                    await Func()
                }
            }
        }
    }

    ),
        document.addEventListener('mousedown', function (event) {
            window.MIOMOD_SAVE.global = {
                x: event.clientX,
                y: event.clientY
            }
        });
        document.addEventListener('click', async (event) => {
            if (event.button === 0) {
                for (const [ObjName, ObjReItems] of Object.entries(CLICK_ITEMS)) {
                    for (const [Keys, Func] of ObjReItems) {
                        if (await Keys[0]()) {
                            await Func()
                        }
                    }
                }

                let currentTime = new Date().getTime();
                if (currentTime - window.MIOMOD_SAVE.mio_hotkey_mod.lastClickTime < 400 && event.clientX === window.MIOMOD_SAVE.global.x && event.clientY === window.MIOMOD_SAVE.global.y) {
                    for (item of CLICK2_ITEMS()) {
                        if (item.items.length > 0) { item.click; break }
                    }
                }
                window.MIOMOD_SAVE.mio_hotkey_mod.lastClickTime = currentTime;

            }
        });

    




} catch { }