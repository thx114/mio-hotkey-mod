import React, { useEffect ,useCallback, useState } from 'react'
import { $Panel, $Button } from 'hookui-framework'

if (typeof jsyaml === 'undefined') {
    const scriptYaml = document.createElement('script');
    scriptYaml.src = 'https://cdn.jsdelivr.net/npm/js-yaml/dist/js-yaml.min.js';
    document.head.appendChild(scriptYaml);
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
                        console.log(list, item)
                        rif().q.to(item).obj.enable
                        await delay(40);
                    }
                    await delay(40);
                    按钮.DEV.分类.过滤器.click
                }


            }

        }
    }
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
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
        )
    }
    document.addEventListener('keydown', async (event) => {
        for (const [ObjName, ObjReItems] of Object.entries(HOTKEYS_ITEMS)) {
            for (const [Keys, Func] of ObjReItems) {
                if (
                    ((Keys.includes('shift')) ? event.shiftKey : true) &&
                    ((Keys.includes('alt')) ? event.altKey : true) &&
                    ((Keys.includes('ctrl')) ? event.ctrlKey : true) &&
                    (Keys.includes(event.code))
                ) {
                    await Func()
                }
            }
        }
    }
    )
} catch { }