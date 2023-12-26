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
function replaceContent() {
    window.__LOGGING__ = 0
    let addinfo = ''

    let time1 = new Date().getTime()
    try {
        const MAIN = {
            主界面: {
                版本: rif({ match: 'inc' }).class('version_VJt')
            },
            悬浮框: {
                标题: rif().class('balloon_qJY.balloon_H23.up_ehW.center_hug.anchored-balloon_AYp.up_el0').class('title_lCJ'),
                内容: rif().class('balloon_qJY.balloon_H23.up_ehW.center_hug.anchored-balloon_AYp.up_el0').class('paragraphs_nbD.description_dNa').first,
                提示: rif().class('tooltip-fade-in S9n')
            },
            工具框: {
                标签: rif().class('tool-options-panel_Se6').class('label_RZX')
            },
            设置: {
                选项: rif().class('menu_hb1.child-opacity-transition_nkS').class('item_pq7.primary_Q54').first,
                标签: rif().class('option-page_CW8.option-section_VzQ').class('main-column_D0A').class('content_gqa').class('label_DGc.label_ZLb'),
                分类: rif().class('option-page_CW8.option-section_VzQ').class('main-column_D0A').class('breadcrumbs_xcd').class('label_sAz.label-level-1'),
                标题: rif().class('option-page_CW8.option-section_VzQ').class('info-column_uQ0').class('info-title_a3p'),
                描述: rif().class('option-page_CW8.option-section_VzQ').class('info-column_uQ0').class('info-description_wwd')
            },
            下拉框: {
                标签: rif().class('dropdown-item_sZT'),
                值: rif().class('dropdown-toggle_V9z').class('label_l_4')
            },
            按钮: rif().class('button_WWa.button_SH8'),
            工具栏: {
                资产详情: {
                    标题: rif().class('asset-detail-panel_hf8.detail-panel_izf').class('title-bar_I7O.child-opacity-transition_nkS').class('title_qub'),
                    描述: rif().class('asset-detail-panel_hf8.detail-panel_izf').class('content_rep.row_H0d.child-opacity-transition_nkS').class('column_dTT').class('paragraphs_nbD.description_ZQn').first
                }
            }
        }
        const 开发者模式 = {
            顶栏: {
                按钮: rif().class('tab-bar_b_c').class('button_BNH').fontCN
            },

            内容: {
                标签: rif().class('content_gqa').class('label_KyX').fontCN,
                按钮: rif().class('content_gqa').class('button_k8s').fontCN,
                标题: rif().class('content_gqa').class('title_Xkf').fontCN,
                值: rif().class('content_gqa').class('value_fMT').fontCN,
                折叠: rif().class('content_gqa').class('label_qS_').fontCN,
                控制值: rif().class('content_gqa').class('control_b3l').fontCN,
            }
        }
        const HOOKUI = {
            顶栏: {
                名称: rif({ mode: 'html', match: 'inc' }).class('content_XD5.content_AD7.child-opacity-transition_nkS').class('row_B8G')
            },
            面板: {
                标题: rif().class('title-bar_PF4').class('title_SVH.title_zQN'),
                内容: rif().class('content_XD5.content_AD7.child-opacity-transition_nkS'),
                标签: rif().class('content_XD5.content_AD7.child-opacity-transition_nkS').class('label_DGc.label_ZLb'),
            }
        }
        const 传统风味 = {
            顶栏: rif().class('panel_YqS.economy-panel_e08').class('header_H_U.header_Bpo.child-opacity-transition_nkS').class('title-bar_PF4').class('title_SVH.title_zQN'),
            TAB: rif().class('panel_YqS.economy-panel_e08').class('tab-bar_oPw').class('tab_Hrb'),
            标题: rif().class('panel_YqS.economy-panel_e08').class('content_XD5.content_AD7.child-opacity-transition_nkS').class('label_VSW.label_T__').first,
            标题2: rif().class('panel_YqS.economy-panel_e08').class('content_XD5.content_AD7.child-opacity-transition_nkS').class('label_VSW.label_T__'),
            描述: rif().class('panel_YqS.economy-panel_e08').class('content_XD5.content_AD7.child-opacity-transition_nkS').class('description_VWf').class('paragraphs_nbD').first,
            选项: rif().class('panel_YqS.economy-panel_e08').class('content_XD5.content_AD7.child-opacity-transition_nkS').class('item_JFN.button_ECf.item_It6.item-mouse-states_Fmi.item-selected_tAM.item-focused_FuT').class('title_sB9'),
            按钮: rif({ match: 'inc' }).class('panel_YqS.economy-panel_e08').class('content_XD5.content_AD7.child-opacity-transition_nkS').class('button_WWa'),
            标签: rif({ match: 'inc' }).class('panel_YqS.economy-panel_e08').class('content_XD5.content_AD7.child-opacity-transition_nkS').class('field_amr.field_cjf').first
        }
        const REPLACE_ITEM_NEW = {
            main: RE(
                [MAIN.主界面.版本], {
                '1.0.18f1': '1.0.18F1 您已启用 都市:天际线2 全局汉化v1.2.8'
            }
            ),
            开发者模式_模拟: RE(
                [开发者模式.内容.标签], {
                'Active tool': '激活工具',
                'Selected': '选中',
                'Taxi Starting Fee': '出租车起步价',
                'High-Speed Highways': '高速公路',
                'Advanced Pollution Management': '高级污染管理',
                'PreRelease Programs': '释前教育',
                'City Promotion': '城市宣传',
                'Allow gameplay manipulation': '允许游戏中操控',
                'Debug toggle': '调试选中',
                'Bypass validation results': '无碰撞',
                'Sim speed': '模拟速度',
                'Smooth speed': '平滑速度',
                'Interpolation offset': '插值偏移',
                'Step Time (ms)': '步进时间 (ms)',
                'Disable trips': '禁用行程',
                'Debug Lifepath Chirps ': '调试生命周期轨迹',
                'Birth Chance': '出生几率',

                'Atmosphere': '大气层',
                'Biome': '生态群落',
                'Water sim speed': '水模拟速度',
                'Time step override': '时间步长',
                'Time Step': '时间步长',
                'Current Time Step': '当前时间步长',
                'Max Velocity': '最大速度',
                'Use Active Cells Culling': '使用活动单元剔除',
                'Water Grid Size Multiplier': '水格大小',
                'Water grid size': '水格大小',
                'Flow number of Downscale': '流动降尺度数量',
                'Blur flow': '流动模糊',
                'Flow limiter for render': '流动渲染限制器',
                'Max Water Flow Length for render': '最大渲染水流长度',
                'Water Flow Render Multiplier': '水流渲染倍增',
                'Climate time': '气候时间',
                'Override Climate time': '气候时间 覆盖',
                'Current climate': '当前气候',
                'Current season': '当前季节',
                'Temperature': '温度',
                'Override Temperature': '覆盖 温度',
                'Snow sim speed': '雪模拟速度',
                'Cloudiness': '云',
                'Override Cloudiness': '云 覆盖',
                'Aurora': '极光',
                'Override Aurora': '极光 覆盖',
                'Precipitation volume scale': '降水量比例',
                'Global VFX time from Simulation time': '全局视觉效果时间与模拟时间关联',
                'Weather VFX time from Simulation time': '天气视觉效果时间与模拟时间关联',
                'Temperature Electricity Consumption Multiplier': '气温电力消耗倍增',
                'Time/Date': '时间/日期',
                'Latitude': '纬度',
                'Longitude': '经度',
                'Day of year': '天 (年)',
                'Day of year (Moon)': '天 (日夜)',
                'Time of day': '时间',
                'Time of day multiplier': '时间流速倍增',
                'Number of lunar cycles per year': '每年的月球周期数',
                'Override time for debug': '时间 覆盖',
                'Superfast building spawning': '超快速建筑生成',
                'Superfast area-prop spawning': '超快速区域道具生成',
                'Superfast leveling': '超快速平整',
                'Select entity': '选择实体',
                'Water Pipe Fluid Flow': '水管液体流动',
                'Disable Water consumption': '禁用水消耗',
                'Disable Sewage generation': '禁用污水生成',
                'Ground Multiplier': '地面污染',
                'Ground Radius': '地面污染范围',
                'Air Radius': '空气污染范围',
                'Noise Radius': '噪音污染范围',
                'Net Noise Radius': '道路 噪音污染范围',
                'Net Noise Multiplier': '道路 噪音污染',
                'Net Air Multiplier': '道路 空气污染',
                'Air Multiplier': '空气污染',
                'Noise Multiplier': '噪音污染',
                'Wind Advection Speed': '风平流速度',
                'Air Fade': '空气污染消退',
                'Ground Fade': '地面污染消退',
                'Plant Air Multiplier': '植物 空气污染倍增',
                'Plant Ground Multiplier': '植物 地面污染倍增',
                'Plant Fade': '植物 消退',
                'Fertility Ground Multiplier': '沃土 地面污染',
                'Distance Expotent': '距离指数',
                'Danger Level': '危险等级',
                'Precipitation': '降水',
                'Override Precipitation': '降水 覆盖',
                'Average temperature': '平均温度',
                'Average precipitation': '平均降水量',
                'Average cloudiness': '平均多云程度',
                'Yearly average temperature': '年均温度',
                'Freezing temperature': '冰点温度',
                'Temperature base height': '温度基准',
                'Snap existing geometry': '对齐现有物体',
                'Snap 90 degree angles': '对齐90度角',
                'Snap road side': '对齐道路两侧',
                'Snap building side': '对齐建筑两侧',
                'Bypass confirmation': '跳过确认',
                'Type': '类别',
                'Mode': '模式',
                'Overwrite existing zone': '覆盖现有区域',
                'Snap cell length': '对齐单元格长度',

            },
                [开发者模式.内容.标题], {
                'Climate time': '气候时间',
                'Temperature': '温度',
                'Precipitation': '降水',
                'Cloudiness': '云',
                'Aurora': '极光'
            },
                [开发者模式.内容.按钮], {
                'Save game': '保存游戏',
                'Load game': '加载游戏',
                'Remove residents/vehicles': '移除居民/车辆',
                'Cleanup obsolete entities': '清理过时实体',

                'Save water': '保存水',
                'Load water': '加载水',
                'Restart water': '重启水',
                'Water to sealevel': '水位调整为海平面(危险)',
                'Reload Water Sources': '重新加载水源(危险)',
                'Override Temperature': '气温',
                'Advance time 1h': '提前1小时',
                'Advance time 12h': '提前12小时',
                'Advance time 6d': '提前6天',
                'Give max resource': '获取最大资源',
                'Print age debug': '打印年龄调试信息',
                'Print school debug': '打印学校调试信息',
                'Print company debug': '打印公司调试信息',
                'Print trade debug': '打印贸易调试信息',
                'Remove extra companies': '移除额外的公司',
                'Print null households': '打印空户调试信息',
                'Calc customers': '计算顾客',
                'Calc eligible': '计算符合条件者',
                'Calc students from OC': '计算OC中的学生',
                'Happiness factors': '幸福因素',
                'Reset land value': '重置土地价值',
                'Reset rents': '重置租金',
                'Reset services': '重置服务',
                'Reset trade costs': '重置贸易成本',
                'Reset transfers': '重置转账',
                'Reset trip neededs': '重置行程需求',
                'Reset storages': '重置存储',
                'Follow selected citizen': '跟随选定居民',
                'Age selected citizen': '年龄调整选定居民',
                'Trigger Test Life Event': '触发测试生活事件',
                'Discard statistics': '丢弃统计信息',
                'Print commuter distribution': '打印通勤分布',
                'Reset Electricity': '重置电力',
                'Reset pollution': '重置污染',
                'Traveling': '旅行中',
                'VisitAttractions': '参观景点',
                'Sightseeing': '观光',
                'Lightning Strike': '雷击',
                'Valentines Day': '情人节',
                'Flood': '洪水',
                'Tsunami': '海啸',
                'Tornado': '龙卷风',
                'Rocket Launch': '火箭发射',
                'Building Collapse': '建筑倒塌',
                'Robbery': '抢劫',
                'Generic Sickness': '一般疾病',
                'Sudden Death': '突然死亡',
                'Severe Injury': '严重伤害',
                'Hail Storm': '冰雹风暴',
                'Lose Control Accident': '失控事故',
                'Forest Fire': '森林火灾',
                'Building Fire': '建筑火灾',
                'Export heightmap': '导出高程图',
                'Create Chirps': '创建轨迹',
                'Check property rent errors': '检查租金错误',
                'Fix property rent errors': '修复租金错误',
                'Fix invalid Enabled Effects': '修复无效的启用效果',
                'Remove snow': '移除雪',
                'Save Wind': '保存风',
                'Load Wind': '加载风',
                'Reset Wind': '重置风',
                'Select next': '选择下一个',
            },
                [开发者模式.内容.值], {
                'Default Tool': '默认工具',
                'Area Tool': '区域工具',
                'Bulldoze Tool': '推土机',
                'Upgrade Tool': '升级工具',
                'Anarchy Tool': '无碰撞工具',
                'Tree 控制ler Tool': '树木控制器',
                'Line Tool': '条形工具',
                'Zone Tool': '功能区工具',
                'Water Tool': '水源工具',
                'Flood Fill': '填充',
                'Marquee': '滚动',
                'Paint': '涂刷'
            },
                [开发者模式.内容.折叠], {
                'Policies': '政策',
                'Diversity': '多样性',
                'Water': '水',
                'Weather & climate': '天气 与 气候',
                'Electricty & Water': '电力 与 水资源',
                'Time': '时间',
                'Economy': '经济',
                'Pollution': '污染',
                'Start event': '开始事件',
                'Terrain': '地形',
                'Triggers': '触发器',
                'Error Check': '错误检查',
                'Season stats': '季节统计',
                'Temperature stats': '温度统计'
            },
                [开发者模式.内容.控制值], {
                'Atmosphere1Prefab': '大气层1预制体',
                'GrasslandBiomePrefab': '草原生态群落预制体',
                'ContinentalCorralRichesClimate': '大陆牧场富饶气候',
                'TemperateSanFranciscoClimate': '温和的旧金山气候',
                'TemperateArchipelagoHavenClimate': '温和的群岛避风港气候',
                'TemperateRiverDeltaClimate': '温带河口气候',
                'SeasonSummer': '夏季季节',
                'Oil Lot - Navigation': '石油地块 - 导航',
                'Ore Lot - Navigation': '矿石地块 - 导航',
                'Agriculture Lot - Field': '农业地块 - 田地',
                'Oil Lot': '石油区域',
                'Ore Lot': '矿石区域',
                'Agriculture Lot': '农业区域',
                'Forestry Lot': '林业区域',
                'Extractor Lot': '提取器区域',
                'District Area': '市辖区域',
                'Clear Area': '清除区域',
                'Clip Surface': '裁剪地面',
                'Walking Area': '行走区域',
                'Map Tile': '地图瓦片',
                'Water Tile': '水瓦片',
                'Hangaround Area': '待遇区域',
                'Park Area': '公园区域',
                'Gympark Area': '健身公园区域',
                'Placeholder': ' 占位符',
                'Oil Surface Placeholder': '石油地面',
                'Ore Surface Placeholder': '矿石地面',
                'Agriculture Surface': '农业地面',
                'Concrete Surface': '混凝土地面',
                'Grass Surface': '草地地面',
                'Pavement Surface': '人行道地面',
                'Sand Surface': '沙地地面',
                'Tiles Surface': '瓷砖地面',
                'Forestry Surface': '林业地面',
                'Landfill Surface': '垃圾填埋地面',
                'Oil Surface 01': '石油地面',
                'Ore Surface 01': '矿石地面',
                'Landfill Site Lot': '垃圾填埋场区域',
            }
            ),
            开发者模式_游戏玩法: RE(
                [开发者模式.内容.标签], {
                'Tutorials enabled': '启用教程',
                'Freeze tutorials': '冻结教程',
                'Active tutorial list': '当前教程列表',
                'Active tutorial': '当前教程',
                'Show developer info': '显示开发者信息',
                'Show unspawned objects': '显示未生成的对象',
                'Show markers': '显示标记',
                'Lefthand traffic': '靠左行驶',
                'Default theme': '默认主题',
                'Hospital service fee': '医院服务费',
                'Basic education service fee': '基础教育服务费',
                'Secondary education service fee': '中等教育服务费',
                'Higher education service fee': '高等教育服务费',
                'Water usage fee': '水费',
                'Garbage collection fee': '垃圾清理费',
                'Electricity fee': '电费',
                'Public transport fee': '公共交通费'
            },
                [开发者模式.内容.按钮], {
                'Skip tutorial phase': '跳过教程阶段',
                'Show all tutorials in advisor': '在顾问中显示所有教程',
                'Skip active tutorial list': '跳过当前教程列表',
                'Select next theme': '选择下一个主题',
                'Unlock all': '解锁全部',
                'Get 200 XP': '获取200经验值',
                'Next MS': '下一个MS',
                'Get 500k money': '获得500,000钱',
            },
                [开发者模式.内容.控制值], {
                'North American': '北美',
                'European': '欧洲'
            }
            ),
            开发者模式_渲染: RE(
                [开发者模式.内容.标签], {
                'Fullscreen Debug Mode': '全屏调试模式',
                'Max Overdraw Count': '最大过度绘制计数',
                'Max Quad Cost': '最大四边形成本',
                'Max Vertex Density': '最大顶点密度',
                'Min Motion Vector Length (in pixels)': '运动矢量长度（以像素为单位）',
                'Mip Maps': 'Mip贴图',
                'Terrain Texture': '地形纹理',
                'False Color Mode': '伪彩模式',
                'Freeze Camera For Culling': '冻结摄像头以进行剔除',
                'Waveform': '波形',
                'Exposure': '曝光',
                'Parade mode': '巡游模式',
                'Vectorscope': '矢量范围',
                'Size': '大小',
                'NVUnityPlugin Version': 'NVUnity插件版本',
                'NGX API Version': 'NGX API版本',
                'Device Status': '设备状态',
                'DLSS Supported': 'DLSS支持',
                'DLSS Injection Point': 'DLSS注入点',
                'Clear Render Targets At Creation': '在创建时清除渲染目标',
                'Disable Pass Culling': '禁用通行剔除',
                'Immediate Mode': '即时模式',
                'Enable Logging': '启用日志记录',
            },
                [开发者模式.内容.值], {
                'Control': '控制',
                'No Visible Camera': '无可见摄像头'
            },
                [开发者模式.内容.标题], {
                'Color Monitors': '色彩监视器',
                '#WaveformContainer': '波形容器',
                '#VectorscopeContainer': '矢量范围容器',
                'NVIDIA device debug view': 'NVIDIA设备调试视图',
                'HDRP Render Graph': 'HDRP渲染图',
                'DLSS Slot ID': 'DLSS 槽位 ID',
                'Status': '状态',
                'Input resolution': '输入分辨率',
                'Output resolution': '输出分辨率',
                'Quality': '质量',
            },
                [开发者模式.内容.按钮], {
                'Log Frame Information': '记录帧信息',
                'Log Resources': '记录资源'
            },
            ),
            开发者模式_游戏渲染: RE(
                [开发者模式.内容.标签], {
                'Texture Debug Mode': '纹理调试模式',
                'Entity culling': '实体剔除',
                'Effect culling': '效果剔除',
                'Batch allocation': '批量分配',
                'Batch upload': '批量上传',
                'Batch groups': '批量分组',
                'Batch renderers': '批量渲染器',
                'Batch materials': '批量材质',
                'Batch meshes': '批量网格',
                'Area triangle buffer': '区域三角形缓冲',
                'Procedural skeleton buffer': '程序骨架缓冲',
                'Procedural skeleton upload': '程序骨架上传',
                'Procedural emissive buffer': '程序自发光缓冲',
                'Procedural emissive upload': '程序自发光上传',
                'Animation shape buffer': '动画形状缓冲',
                'Animation bone buffer': '动画骨骼缓冲',
                'Animation frame buffer': '动画帧缓冲',
                'Animation index buffer': '动画索引缓冲',
                'Animation meta buffer': '动画元数据缓冲',
                'Level of detail': '细节级别',
                'Disable lod models': '禁用LOD模型',
                'Disable mesh loading': '禁用网格加载',
                'Force mesh unloading': '强制卸载网格',
                'Strict mesh memory budget': '严格的网格内存限制',
                'Long cross fade': '淡入淡出',
                'Debug': '调试',
                'Punctual Lights': '点光源',
                'Max Punctual Lights': '最大 点光源 数量',
                'Punctual Lights Cookies': '点光源 Cookies',
                'Enable Min-Max light culling optim': '启用最小-最大点光源光照剔除优化',
                'Max Distance Culling Scale': '最大距离剔除比例',
                'Min Distance Culling Scale': '最小距离剔除比例',
                'Number of punctual lights': '点光源数量',
                'Tri count': '三角形数量',
                'Foliage': '植被',
                'DebugBlit': '调试Blit',
                'Tunnel Pass': '隧道通道',
                'Outlines Pass': '轮廓通道',
                'Dynamic Resolution': '动态分辨率',
                'Upscale Filter': '升采样滤镜',
                'Auto Adaptive': '自适应',
                'CBT Max Depth': 'CBT最大深度',

                'All': '全部',
                'Shader Graphs/AreaDecalShader': 'SG/区域标贴',
                'BH/SG_CurvedShader': 'BH/SG_曲线',
                'BH/Overlay/CurvedOverlayShader': 'BH/覆盖/曲线覆盖',
                'BH/Decals/CurvedDecalShader': 'BH/标贴/曲线标贴',
                'BH/Decals/CurvedDecalDeteriorationShader': 'BH/标贴/曲线标贴退化',
                'BH/Pipeline/CurvedPipelineShader': 'BH/管道/曲线管道',
                'BH/SG_DefaultShader': 'BH/SG_默认',
                'BH/SG_BaseShader': 'BH/SG_基础',
                'BH/NetCompositionMeshLitShader': 'BH/网络组合网格光照',
                'BH/Pipeline/DefaultPipelineShader': 'BH/管道/默认管道',
                'BH/Decals/DefaultDecalShader': 'BH/标贴/默认标贴',
                'BH/Impostors/Render/SG_ImpostorTree': 'BH/冒牌/渲染/SG_冒牌树',
                'BH/SG_VegRootShader': 'BH/SG_植被根',
                'BH/SG_VegLeavesShader': 'BH/SG_植被叶',
                'Shader Graphs/ZoneBlock': 'SG/功能区',
                'BH/SG_WinShader': 'BH/SG_窗户',
                'BH/WinShader': 'BH/玻璃',
                'BH/WatShader': 'BH/水',

                'Didimo/HDRP/SG_CharacterSkin': 'Didimo/HDRP/SG_角色皮肤',
                'Didimo/HDRP/HDRPGenericCrowd': 'Didimo/HDRP/HDRP通用群体',
                'Didimo/HDRP/SG_CharacterCloth': 'Didimo/HDRP/SG_角色布料',
                'Didimo/HDRP/SG_CharacterGeneric': 'Didimo/HDRP/SG_角色通用',
                'BH/Characters/SG_HairCardsDyed': 'BH/角色/SG_染色发卡',
                'BH/GraShader': 'BH/GraShader',

                'Scale': '渲染精度'
            },
                [开发者模式.内容.值], {
                'Catmull Rom': 'Catmull-Rom',
            },
                [开发者模式.内容.按钮], {
                'Refresh splatmap': '刷新地表纹理图',
            },
                [开发者模式.内容.折叠], {
                'Scale': '缩放',
                'Shaders': '着色器',
                'Custom passes': '自定义通道',
            },
                [开发者模式.内容.控制值], {
                'Scale': '渲染精度',
                'Unknown': '未知',
                'False': '否',
                'BeforePost': '后处理前'
            }
            ),
            开发者模式_工具: RE(
                [开发者模式.内容.标签], {
                'Physical Objects': '物理对象',
                'Marker Objects': '标记对象',
                'Draw Pivots': '绘制枢轴',
                'Interpolated Positions': '插值位置',
                'Net Connections': '网络连接',
                'Group Connections': '组连接',
                'District Connections': '区域连接',
                'Lot Heights': '地块高度',
                'Draw Nodes': '绘制节点',
                'Draw Edges': '绘制边缘',
                'Draw Outlines': '绘制轮廓',
                'Standalone Lanes': '独立车道',
                'Slave Lanes': '从属车道',
                'Master Lanes': '主车道',
                'Connection Lanes': '连接车道',
                'Draw Overlaps': '绘制重叠',
                'Draw Reserved': '绘制保留',
                'Draw Blocked': '绘制阻塞',
                'Draw Condition': '绘制条件',
                'Draw Signals': '绘制信号',
                'Draw Priorities': '绘制优先级',
                'Show positions': '显示位置',
                'Spot Lights Cones': '聚光灯锥形',
                'Show active water cell': '显示活动水格',
                'Fixed Height': '固定高度',
                'Draw Pivots': '绘制枢轴',
                'Draw Grids': '绘制网格',
                'Vacant Lots': '空地块',
                'Lots': '地块',
                'Districts': '区域',
                'Map Tiles': '地图瓦片',
                'Spaces': '空间',
                'Surfaces': '表面',
                'Routes': '路径',
                'Lane Connections': '车道连接',
                'Humans': '人类',
                'Animals': '动物',
                'Cars': '汽车',
                'Trains': '火车',
                'Ships': '船只',
                'Aircrafts': '飞机',
                'Workplaces': '工作场所',
                'Services': '服务',
                'UneducatedCitizens': '未受教育的市民',
                'EducatedCitizens': '受过教育的市民',
                'OutsideConnection': '外部连接',
                'ConvenienceFoodStore': '便利食品店',
                'GrainSupply': '谷物供应',
                'VegetableSupply': '蔬菜供应',
                'WoodSupply': '木材供应',
                'TextilesSupply': '纺织品供应',
                'ConvenienceFoodSupply': '便利食品供应',
                'PaperSupply': '纸张供应',
                'VehiclesSupply': '车辆供应',
                'OilSupply': '石油供应',
                'PetrochemicalsSupply': '石化产品供应',
                'OreSupply': '矿石供应',
                'MetalsSupply': '金属供应',
                'ElectronicsSupply': '电子产品供应',
                'Attractiveness': '吸引力',
                'PlasticsSupply': '塑料供应',
                'CoalSupply': '煤炭供应',
                'StoneSupply': '石材供应',
                'LivestockSupply': '牲畜供应',
                'CottonSupply': '棉花供应',
                'SteelSupply': '钢铁供应',
                'MineralSupply': '矿物供应',
                'ChemicalSupply': '化学品供应',
                'MachinerySupply': '机械设备供应',
                'BeveragesSupply': '饮料供应',
                'TimberSupply': '木材供应',
                'Taxi': '出租车',
                'Healthcare': '医疗保健',
                'FireRescue': '消防救援',
                'Police': '警察',
                'Park': '公园',
                'PostService': '邮政服务',
                'Education': '教育',
                'EmergencyShelter': '紧急避难所',
                'Welfare': '福利',
                'Draw Graph': '绘制图表',
                'Show Restrictions': '显示限制',
                'Show time cost': '显示时间成本',
                'Show behavior cost': '显示行为成本',
                'Show money cost': '显示金钱成本',
                'Show comfort cost': '显示舒适度成本',
                'Visualize Queries': '可视化查询',
                'Static Objects': '静态对象',
                'Moving Objects': '移动对象',
                'Nets': '网络',
                'Lanes': '车道',
                'Zones': '区域',
                'Areas': '地区',
                'Routes': '路径',
                'Effects': '效果',
                'Local Effects': '局部效应',
                'Land value': '土地价值',
                'StorageLeveling': '存储水准',
                'Leveling': '水准',
                'Buildings': '建筑物',
                'Residential worth': '住宅价值',
                'Commercial worth': '商业价值',
                'Industrial worth': '工业价值',
                'Untaxed income': '免税收入',
                'Storage used': '存储使用',
                'Ground pollution': '地面污染',
                'Air pollution': '空气污染',
                'Noise pollution': '噪音污染',
                'Forest': '森林',
                'Accumulated Garbage': '累积垃圾',
                'Produce Garbage': '产生垃圾',
                'Show Surface Boxes': '显示表面框',
                'Show Culling Boxes': '显示裁剪框',

                'Object Debug System': '物件 调试系统',
                'Net Debug System': '道路 调试系统',
                'Lane Debug System': '车道 调试系统',
                'Light Debug System': '光照 调试系统',
                'Water Culling Debug System': '水裁剪 调试系统',
                'Zone Debug System': '功能区 调试系统',
                'Area Debug System': '区域 调试系统',
                'Route Debug System': '路径 调试系统',
                'Navigation Debug System': '导航 调试系统',
                'Audio Grouping Debug System': '音频分组 调试系统',
                'Availability Debug System': '可用率 调试系统',
                'Density Debug System': '密度 调试系统',
                'Coverage Debug System': '覆盖 调试系统',
                'Path Debug System': '路径 调试系统',
                'Pathfinding Debug System': '路径规划 调试系统',
                'Search Tree Debug System': '搜索树 调试系统',
                'Terrain Attractiveness Debug System': '地形吸引力 调试系统',
                'Land Value Debug System': '土地价值 调试系统',
                'Economy Debug System': '经济 调试系统',
                'Pollution Debug System': '污染 调试系统',
                'Ground Water Debug System': '地下水 调试系统',
                'Soil Water Debug System': '土壤水分 调试系统',
                'Natural Resource Debug System': '自然资源 调试系统',
                'Garbage Debug System': '垃圾 调试系统',
                'Terrain Debug System': '地形 调试系统',
                'Water Debug System': '水 调试系统',
                'Wind Debug System': '风 调试系统',
                'Event Debug System': '事件 调试系统',

                'Tradecost Debug System': '(危险) 贸易成本 调试系统',
                'Buildable Area Debug System': '可建造区域 调试系统'
            }
            ),
            开发者模式_main: RE(
                [开发者模式.顶栏.按钮], {
                'Display Stats': '显示数据',
                'Thumbnails': '缩略图',
                'Asset database': '数据',
                'Notifications': '通知',
                'ECS Components': 'ECS 组件',
                'Scene Flow': '场景流程',
                'GameRendering': '游戏渲染',
                'Gameplay': '游戏玩法',
                'Localization': '本地化',
                'UI Bindings': 'UI 绑定',
                'Watches': '监视器',
                'Radio': '无线电',
                'Climate': '气候',
                'Simulation': '模拟',
                'Pathfind': '寻路',
                'Serialization': '序列化',
                'Gizmos': '工具',
                'Camera': '摄像机',
                'Input': '输入',
                'Decals': '标贴',
                'Material': '材质',
                'Lighting': '光照',
                'Rendering': '渲染',
                'Profiler Metrics': '性能分析指标',
                'Main Camera': '主摄像机',
                'Virtual Texturing': '虚拟纹理',
                'Volume': '音量',
            },
                [开发者模式.内容.标签], {
                'Fullscreen Debug': '全屏调试'
            },
                [开发者模式.内容.值], {
                'Disabled': '关闭',
                'Enabled': '开启',
                'None': '无',
            },
            ),
            信息隐现: RE(
                [HOOKUI.顶栏.名称], {
                'InfoLoom: Demographics': '信息隐现: 人口分布',
                'InfoLoom: Workforce': '信息隐现: 劳动力结构',
                'InfoLoom: Workplaces': '信息隐现: 工作场所',
                'InfoLoom: Demand Factors': '信息隐现: 建筑需求',
            },
                [HOOKUI.面板.标题], {
                'Demographics': '人口统计',
                'Demand': '需求',
                'Workforce Structure': '劳动力结构',
                'Workplace Distribution': '工作场所分布'
            },
                [rif().class('content_XD5.content_AD7.child-opacity-transition_nkS').class('row_S2v').isStyle('width: 60.000000%; justify-content: center; ')], {
                'All Citizens': '所有市民',
                '- Locals': '- 本地居民',
                '- Tourists': '- 游客',
                '- Commuters': '- 通勤者',
                'Moving Away': '搬离中',
                'Oldest citizen': '最年长市民',
                'Students': '学生',
                'Workers': '工人',
                'Homeless': '无家可归',
                'Dead': '死亡'
            },
                [rif().class('content_XD5.content_AD7.child-opacity-transition_nkS').index(2).all], {
                'Work': '工作',
                'Elementary': '小学',
                'High school': '中学',
                'College': '学院制大学',
                'University': '综合性大学',
                'Other': '其他'
            },
                [rif().class('content_XD5.content_AD7.child-opacity-transition_nkS').class('symbol_aAH').next], {
                'Education': '教育',
                'Uneducated': '无学历',
                'Poorly Educated': '低学历',
                'Highly Educated': '高学历',
                'Well Educated': '极高学历',
                'Educated': '普通学历',
                'TOTAL': '总计'
            },
                [rif().class('content_XD5.content_AD7.child-opacity-transition_nkS').class('labels_L7Q.row_S2v').class('row_S2v').haveStyle('justify-content: center')], {
                'Total': '总计',
                'Workers': '工人',
                'Unemployed': '失业',
                'Under': '在读',
                'Outside': '在外',
                'Homeless': '无家可归',

                'City': '服务',
                'Sales': '销售',
                'Leisure': '休闲',
                'Extract': '开采',
                'Industry': '工业',
                'Office': '办公',
                'Employees': '员工',
                'Open': '开放'
            },
                [rif().class('infoview-panel-section_RXJ').class('left_Lgw.row_S2v')], {
                'BUILDING DEMAND': '建筑需求',
                'Residential Low': '低密度住宅',
                'Residential Medium': '中密度住宅',
                'Residential High': '高密度住宅',
                'Commercial': '商业',
                'Industrial': '工业',
                'Storage': '仓储',
                'Office': '办公',

                'RESIDENTIAL LOW': '低密度住宅',
                'RESIDENTIAL MEDIUM': '中密度住宅',
                'RESIDENTIAL HIGH': '高密度住宅',
                'COMMERCIAL': '商业',
                'INDUSTRIAL': '工业',
                'OFFICE': '办公',

                'EmptyBuildings': '空置建筑',
                'Happiness': '幸福度',
                'Taxes': '税收',
                'Unemployment': '失业率',
                'UneducatedWorkforce': '未受教育劳动力',
                'EducatedWorkforce': '受教育劳动力',
                'LocalDemand': '本地需求',
                'LocalInputs': '本地资源',
                'Homelessness': '无家可归',
                'Students': '学生',
                'Warehouses': '仓库',
                'PetrolDemand': '汽油需求',
                'TouristDemand': '游客需求'
            }
            ),
            失业监视器: RE(
                [HOOKUI.面板.标题], {
                'Unemployment': '失业监视器'
            },
                [HOOKUI.顶栏.名称], {
                'Unemployment Data': '失业监视器',
                'Unemployment Monitor': '失业监视器',
            },
                [rif().class('panel_YqS').index(1).first.all.first.haveStyle('flex: 1.000000')], {
                'Unemployed': '失业',
                'Homeless Households': '无家可归的家庭'
            },
                [rif().class('panel_YqS').index(1).index(1).all.first.haveStyle('font-weight')], {
                'TO': '总',
                'UN': '无',
                'PO': '低',
                'ED': '中',
                'WE': '高',
                'HI': '极高',
            },
                [rif().class('panel_YqS').index(1).index(1).index(6)], {
                'Total': '所有',
                'Uneducated': '无学历',
                'Poorly Educated': '低学历',
                'Well Educated': '高学历',
                'Highly Educated': '极高学历',
                'Educated': '普通学历',
            }
            ),
            城市监视器: RE(
                [HOOKUI.面板.标题, HOOKUI.顶栏.名称], {
                'City Monitor': '城市监视器',
            },
                [rif().class('content_1xS.focusable_GEc.item-focused_FuT').class('labels_L7Q.row_S2v').class('uppercase_RJI.left_Lgw.row_S2v'), rif().class('content_XD5.content_AD7.child-opacity-transition_nkS').class('label_VSW.label_T__')], {
                'Electricity Availability': '电力资源可用性',
                'Water Availability': '水资源可用率',
                'Sewage': '污水处理',
                'Landfill Usage': '垃圾填埋使用率',
                'Healthcare Availability': '医疗资源可用率',
                'Average Health': '平均健康状况',
                'Cemetery Availability': '公墓资源可用率',
                'Fire Hazard': '火灾危险',
                'Crime Rate': '犯罪率',
                'Jail Availability': '监狱资源可用率',
                'Elementary School Availability': '小学资源可用率',
                'High School Availability': '中学资源可用率',
                'College Availability': '学院制大学资源可用率',
                'University Availability': '综合性大学资源可用率'
            },
                [rif().class('content_XD5.content_AD7.child-opacity-transition_nkS').class('button_WWa')], {
                'Settings': '设置',
                'Meters': '完成'
            }
            ),
            条形工具: RE(
                [rif().class('tool-options-panel_Se6').id('line-tool-title')], {//
                'Line Tool': '条形工具',//
            },
                [MAIN.工具框.标签], {
                'Line mode': '模式',//
                'Rotation': '旋转',//
                'Spacing variation': '随机间距',//
                'Offset variation': '随机偏移',//
                'Spacing': '间距',//
                'Options': '设置'
            },
                [MAIN.悬浮框.标题], {
                'Fence mode': '围栏模式',//
                'Straight line': '直线',//
                'Simple curve': '简单曲线',//
                'Circle': '圆形',//
                'Fixed length': '固定长度',//
                'Decrease spacing': '减小间距',//
                'Increase spacing': '增大间距',//
                'Random rotation': '随机旋转',//
                'Rotate anti-clockwise': '逆时针旋转',//
                'Rotation': '旋转',//
                'Rotate clockwise': '顺时针旋转',//
                'Decrease random spacing variation': '减小随机间距变化',//
                'Spacing variation': '随机间距',//
                'Increase random spacing variation': '增大随机间距变化',//
                'Decrease random sideways variation': '减小随机横向变化',//
                'Offset variation': '随机偏移',//
                'Increase random sideways variation': '增大随机横向变化',//
                'Spacing': '间距',//
                'Single item': '放置单个物件'
            },
                [MAIN.悬浮框.内容], {
                'Automatically aligns and places objects continuously, like a fence.':
                    '自动连续对齐和放置对象，如围栏。',//

                'Place objects along a straight line from point A to point B.':
                    '在从A点到B点的直线上放置对象。',//

                'Define a start and bend, then define end point.':
                    '定义起点和弯曲点，然后定义终点。',//

                'Define the center of the circle, then set the radius.':
                    '定义圆的中心，然后设置半径。',//

                'Space items along the full length of the line from start to end, using the set spacing distance only as an approximation. If this is NOT set then items will be spaced exactly according to the set distance, even if it means they can\'t be placed along the full length of the line.':
                    '将物品沿着从起点到终点的直线的整个长度间隔排列，仅使用设置的间距距离作为近似值。如果未设置，则物品将根据设置的距离准确排列，即使这意味着它们不能沿直线的整个长度放置。',//

                'Change the step size by holding down the shift key (step by 10m) or control key (step by 0.1m) when clicking.':
                    '通过按住 shift 键(步进10米)或 control 键(步进0.1米)并单击时更改步进大小。',//

                'Objects will be spaced apart by this amount (or approximately this amount if fixed length spacing is selected).':
                    '物体之间的间隔将为此数量(如果选择了固定长度间隔，则为大约此数量)。',//

                'Rotate each item randomly so they all face in different directions.':
                    '随机旋转每个物体，使它们朝向不同方向。',//

                'Change the step size by holding down the shift key (rotate by 90°) or control key (rotate by 1°) when clicking.':
                    '通过按住 shift 键(旋转90°)或 control 键(旋转1°)并单击时更改步进大小。',//

                'Objects will be rotated by this amount.':
                    '物体将旋转这么多。',//

                'Change the step size by holding down the shift key (step by 10m) or control key (step by 0.1m) when clicking. Set to zero for precise placement.':
                    '通过按住 shift 键(步进10米)或 control 键(步进0.1米)并单击时更改步进大小。设置为零以进行精确放置。',//


                'Object spacing along the line will be varied by a random distance up to this maximum. Set to zero for precise placement.':
                    '沿着直线的物体间距将变化到最大随机距离。设置为零以进行精确放置。',//

                'Objects will be randomly offset sideways from the line up to this maximum distance. Set to zero for precise placement.':
                    '物体将从直线侧向随机偏移到最大距离。设置为零以进行精确放置。',//

                'Place one object at a time using the standard game tool.': '使用标准游戏工具一次放置一个对象。'

            },
                [rif().id('line-tool-title')], {
                'Line tool': '条形工具'
            }


            ),
            树木控制器: RE(
                [MAIN.悬浮框.提示], {
                'Right Click to Apply.': '右键以应用'

            },
                [MAIN.工具框.标签], {
                'Age': '树木年龄',
                'Selection': '选择',
                'Radius': '范围',
                'Tool Mode': '工具模式',
                'Sets': '集合',
            },
                [MAIN.设置.选项], {
                'Tree Controller': '树木控制器'
            },
                [MAIN.设置.标签, MAIN.设置.标题], {
                'Deciduous trees use Dead Model during Winter': '在冬季:落叶树使用枯木模型',
                'Disable Tree Growth': '禁用树木自然生长',
                'Age Selection Technique': '树木年龄随机方法',
                'Color Variation Set': '颜色变化集'
            },
                [MAIN.设置.描述], {
                'Will temporarily make all non-lumber industry deciduous trees use the dead model and pause growth during winter.':
                    '会暂时性的把所有 (非林场) 的落叶树转换为枯木模型',

                'Disable tree growth for the entire map except for lumber industry.':
                    '禁用整个地图的 (非林场) 树木的自然生长',

                '"When multiple Tree Ages are selected, one will be selected using this option. Random: Equal Weight is just a random selection. Random: Weighted randomly selected using game\'s editor weights. Sequential: does selected ages in order."':
                    '当选择多个树木年龄时，可以使用此选项选择树木年龄的随机方式。【随机：完全随机】【随机：按游戏编辑器中的权重随机选择】【顺序：按顺序选择所选的树木年龄】',

                'Sets of seasonal colors for Trees and Wild bushes. Vanilla is the base game. Yenyang\'s is my curated colors. Custom uses CSV files in the mod folder.': '树木和野生灌木的季节性颜色集。【原版】 是基础游戏的颜色。【Yenyang的颜色集】 是我策划的颜色。【自定义】 使用模组文件夹中的 CSV 文件',

                'After confirmation this will reload CSV files.':
                    '确认后，将重新加载 CSV 文件。',

                'Removes Tree Controller mod components and resets tree and bush model states. Only necessary during Winter and very end of Autumn. Must use reset button to undo setting change.':
                    '移除树木控制器模组的组件并重置树木和灌木模型状态。仅在冬季和秋季末尾非常需要。必须使用重置按钮来撤销设置更改。',

                'After confirmation this will reset Tree Controller Settings.':
                    '确认后，将重置树木控制器设置。'

            },
                [MAIN.下拉框.标签, MAIN.下拉框.值], {
                'Random: Equal Weight': '随机：完全随机',
                'Random: Weighted': '随机：按游戏编辑器',
                'Vanilla': '原版',
                'Yenyang\'s': 'Yenyang的颜色集',
                'Custom': '自定义'
            },
                [MAIN.按钮, MAIN.设置.标题], {
                'Reload CSVs': '重载CSV颜色集',
                'Safely Remove': '安全移除',
                'Reset Tree Controller Settings': '重置 树木控制器 模组设置'
            }
            ),
            车辆计数器: RE(
                [HOOKUI.面板.标题, HOOKUI.顶栏.名称], {
                'Vehicle Counter': '车辆计数器'
            },
                [HOOKUI.面板.标签], {
                'Active vehicles': '激活的车辆'
            },
                [MAIN.按钮], {
                'Remove vehicles': '移除车辆'
            }
            ),
            传统风味: RE(
                [传统风味.顶栏, HOOKUI.顶栏.名称], {
                'Legacy Flavour': '传统风味'
            },
                [传统风味.TAB], {
                'Zone Settings': '功能区设置',
                'Settings': '设置',
                'Zone Colours': '功能区颜色',
                'UI Themes': 'UI 主题',
                'About': '关于',
                'Accent': '强调',
                'Panel': '面板',
                'Section': '部分',
                'Selected': '已选择',
                'Text': '文本',
                'Menu': '菜单',
                'Other': '其他'
            },
                [传统风味.标题], {
                'Use Sticky Whiteness': '持久信息视图白色',
                'Whiteness Toggle': '信息视图白色切换',
                'Use Units': '使用 U 长度单位',
                'Freeze time visuals': '冻结时间视觉效果',
                'Set visual time of day': '设置视觉时间',
                'Weather': '天气',
                'Custom Zone Colouring': '自定义区域着色',
                'Use Dynamic Cell Borders': '使用动态单元边界',
                'Empty Cell Opacity': '空单元透明度',
                'Empty Cell Border Opacity': '空单元边界透明度',
                'Cell Opacity': '单元透明度',
                'Cell Border Opacity': '单元边界透明度',
                'Colour Blindness Mode': '色盲模式',
                'Residential': '住宅区',
                'Commercial': '商业区',
                'Office': '办公区',
                'Theme': '主题',
                'Generate from colour': '从颜色生成',
                'Legacy Flavour': '传统风味',

                'Industrial': '工业'
            },
                [传统风味.标题2], {
                'Make window transparent': '使窗口透明',
            },
                [传统风味.描述], {
                'Override the games white info-mode switch, using a custom setting. Toggle with ALT+S.':
                    '覆盖游戏的白色信息模式切换，使用自定义设置 -快捷键: ALT+S',

                'If \'Use Sticky Whiteness\' is enabled, the info-mode white setting will be set to this value when a tool with an info-mode is activated. Toggle with SHIFT+W.':
                    '如果启用了“使用持久白色”，则在启用带有信息模式的工具时，信息模式白色设置将被设置为此值 -快捷键: SHIFT+W',
                'When a tool system with a length measurement is selected, use \'units\' instead. Toggle with ALT+U.':
                    '当选择具有长度测量的工具系统时，请改用“单位”代替 -快捷键: ALT+U',

                'When enabled, freezes the visual time of day. \'Day/Night Visuals\' must be on.':
                    '启用后,冻结视觉时间。必须打开“日夜效果”',

                'Override the visual time of day. \'Day/Night Visuals\' must be on. If golden hour goes to midnight the map is missing settings.':
                    '覆盖视觉时间。必须打开“日夜效果”',

                'Override the weather': '覆盖天气',

                'Provides custom zone colour options that can be cycled with a key shortcut. Toggle with ALT+Z.': '提供可以使用快捷键循环的自定义区域颜色选项。',
                'Zone cell borders will adjust to be more visible when there is snow coverage.': '当有积雪覆盖时，区域单元边界将调整为更加可见。',
                'Change the transparency of non-empty zone cells.': '更改非空区域单元的透明度。',
                'Change the border transparency of non-empty zone cells.': '更改非空区域单元的边界透明度。',
                'Change the transparency of empty zone cells.': '更改空区域单元的透明度。',
                'Change the border transparency of empty zone cells.': '更改空区域单元的边界透明度。',
                'Select a different colour mode, you can cycle these with the keys SHIFT+Z.': '选择不同的颜色模式 -快捷键 SHIFT+Z',
                'Modify Residential zone colours': '修改住宅区颜色',
                'Modify Commercial zone colours': '修改商业区颜色',
                'Modify Office zone colours': '修改办公区颜色',
                'Select a theme to edit': '选择要编辑的主题',
                'Select a base theme, main accent colour and generate a theme.': '选择基本主题、主要强调颜色并生成主题。',
                'This mod was developed by the optimus-code and the Cities2Modding community.': '此模组由optimus-code和Cities2Modding社区开发。',
                'Modify Industrial zone colours': '修改工业区颜色'
            },
                [传统风味.选项], {
                'Off': '关闭',
                'Day': '白天',
                'Golden Hour': '黄金时段',
                'Night': '夜晚',
                'Sun': '晴朗',
                'Overcast': '阴天',
                'Rain': '雨天',
                'Snow': '雪天'
            },
                [传统风味.按钮], {
                'Reset to default': '重置至默认',
                'Set': '设置',
                'to vanilla colours': '到原版颜色',
                'Regenerate icons': '重新生成图标',
                'Game restart required': '需要重新启动游戏',
                'Reset': '重置'
            },
                [MAIN.下拉框.值, MAIN.下拉框.标签, 传统风味.按钮], {
                'Default Colours': '默认颜色',
                'Deuteranopia': '绿色盲',
                'Protanopia': '红色盲',
                'Tritanopia': '蓝色盲',
                'Use selected theme': '使用选定的主题',
                'Default': '默认',
                'Bright Blue': '亮蓝',
                'Dark Grey Orange': '深灰橙',
                'LF - Default': 'LF - 默认',
                'LF - High Contrast': 'LF - 高对比',
                'LF - Hot Pink': 'LF - 热粉',
                'LF - Toxic Green': 'LF - 有毒绿',
                'LF - Mocha': 'LF - 摩卡',
                'LF - Peachy Ocean': 'LF - 桃子海洋',
                'LF - Dark Red': 'LF - 深红',
                'LF - Cool Blue': 'LF - 冷蓝',
                'LF - Dark Teal': 'LF - 深青'
            },
                [传统风味.标签], {
                'Residential Low': '低密度住宅',
                'Residential Medium': '中密度住宅',
                'Residential Medium Row': '中密度联排住宅',
                'Residential LowRent': '廉租公寓',
                'Residential High': '高密度住宅',
                'Residential Mixed': '混合型住宅',
                'Commercial High': '高密度商业',
                'Commercial Low': '低密度商业',
                'Office High': '高密度办公',
                'Office Low': '低密度办公',
                'Primary Accent': '主要强调',
                'Background Accent': '背景强调',
                'Focused Color Dark': '聚焦颜色深',
                'Focused Color': '聚焦颜色',

                'Hover': '悬停',
                'Pressed': '按下',
                'Focused': '聚焦',
                'Accent Color Dark': '强调颜色深',
                'Accent Color Normal': '强调颜色正常',
                'Accent Color Lighter': '强调颜色较亮',
                'Accent Color Light': '强调颜色浅',

                'Custom Panel Text Color': '自定义面板文本颜色',
                'Panel Color Normal': '面板颜色正常',
                'Pause Panel Color Dark': '暂停面板颜色深',
                'Panel Color Dark Active': '面板颜色深活动',
                'Panel Color Dark': '面板颜色深',

                'Section Header Locked Color': '部分标题锁定颜色',
                'Section Header Color Light': '部分标题颜色浅',
                'Section Header Color': '部分标题颜色',

                'Section Background Color Light': '部分背景颜色浅',
                'Section Background Color': '部分背景颜色',
                'Section Background Locked Color': '部分背景锁定颜色',
                'Section Border Color': '部分边框颜色',

                'Selected Text Color Dimmest': '选定文本颜色最暗',
                'Selected Text Color Dimmer': '选定文本颜色较暗',
                'Selected Text Color Dim': '选定文本颜色中等',
                'Selected Text Color': '选定文本颜色',
                'Selected Color Dark': '选定颜色深',
                'Selected Color Active': '选定颜色活动',
                'Selected Color': '选定颜色',

                'Normal Text Color Dimmest': '普通文本颜色最暗',
                'Normal Text Color Dimmer': '普通文本颜色较暗',
                'Normal Text Color Dim': '普通文本颜色中等',
                'Normal Text Color Dark Dimmer': '普通文本颜色深较暗',
                'Normal Text Color Dark Dimmest': '普通文本颜色深最暗',
                'Normal Text Color Dark Dim': '普通文本颜色深暗',
                'Normal Text Color Dark': '普通文本颜色深',
                'Normal Text Color': '普通文本颜色',

                'Menu Panel1': '菜单面板1',
                'Menu Panel2': '菜单面板2',
                'Menu Title Normal': '菜单标题正常',
                'Menu Text1 Normal': '菜单文本1正常',
                'Menu Text1 Inverted': '菜单文本1反色',
                'Menu Text1 Disabled': '菜单文本1禁用',
                'Menu Text2 Normal': '菜单文本2正常',
                'Menu Text2 Inverted': '菜单文本2反色',
                'Menu Control Border': '菜单控件边框',

                'Custom Chirper Panel Text Color': '自定义Chirper面板文本颜色',
                'Custom Chirper Panel Color': '自定义Chirper面板颜色',
                'Custom Chirper Item Text Color': '自定义Chirper项目文本颜色',
                'Custom Chirper Item Color': '自定义Chirper项目颜色',
                'Custom Tab Text Color': '自定义选项卡文本颜色',
                'Custom Tab Selected Text Color': '自定义选项卡选定文本颜色',

                'Positive Color': '正向颜色',
                'Warning Color': '警告颜色',
                'Negative Color': '负向颜色',

                'Industrial Agriculture': '工业农业',
                'Industrial Forestry': '工业林业',
                'Industrial Manufacturing': '工业制造',
                'Industrial Oil': '工业石油',
                'Industrial Ore': '工业矿石'
            }
            ),
            限速模组: RE(
                [HOOKUI.顶栏.名称], {
                'Speed Limit': '限速模组',
            },
                [HOOKUI.面板.标题], {
                'Speed Limit Editor': '限速模组:修改器'
            },
                [rif().class('content_XD5.content_AD7.child-opacity-transition_nkS').first], {
                'No Road Selected': '没有道路被选择'
            }
            ),
            出行解锁: RE(
                [HOOKUI.面板.标题, HOOKUI.顶栏.名称], {
                'Traffic Unlocker': '出行解锁'
            },
                [HOOKUI.面板.标签], {
                'Population': '人口',
                'Traffic Reduction': '交通抑制系数',
                'Work Probability': '工作概率',
                'School Probability': '上学概率',
                'Leisure Probability': '休闲概率'
            }
            ),
            道路扩展升级: RE(
                [MAIN.工具栏.资产详情.标题], {
                'Quay': '护坡',
                'Retaining Wall': '护墙',
                'Elevated': '高架',
                'Tunnel': '隧道'
            },
                [MAIN.工具栏.资产详情.描述], {
                'A quay, if you installed this mod you know what it is :)': '护坡，如果你安装了这个模组，你知道它是什么:)',
                'A retaining wall, if you installed this mod you know what it is :)': '护墙，如果你安装了这个模组，你知道它是什么:)',
                'Elevated mode, kind of similar to bridges': '高架模式，有点类似于桥梁',
                'Tunnel mode, it might not look perfect but it works.': '隧道模式，它可能看起来不完美，但它能工作。'
            }
            ),
            更难的经济: RE(
                [MAIN.设置.选项], {
                'Economy Fixer': '难度更高的经济'
            },
                [MAIN.设置.分类], {
                'Gameplay Options': '游戏中设置'
            },
                [MAIN.设置.标签, MAIN.设置.标题], {
                'Economy Difficulty': '经济难度',
                'Bulldozing Building Costs Money': '拆除建筑需要拆迁费',
                'Bulldoze & De-zoning Causes Demolition': '推土机或取消功能区会导致建筑变成废墟'
            },
                [MAIN.设置.描述], {
                'Higher difficulty results in decreased subsidies, milestone rewards, income & higher expenses.': '更高的难度会导致减少补贴、里程碑奖励、收入和增加开支。',
                'Adds a monthly maintenance fee for demolition buildings. This fee is based on how many residents are getting evicted, how high the land value is, and how large is the building itself.': '为拆迁建筑添加了一个月度维护费用。该费用基于有多少居民被驱逐、土地价值有多高以及建筑本身有多大。',
                'Bulldozing a building or de-zoning an area will cause the buildings to collapse instead of disappearing, collapsed buildings take time to be cleaned up and affect nearby happiness. You can pay a small fee to immediately raze collapsed buildings.': '推倒建筑或取消区域划分将导致建筑物崩溃而不是消失，崩溃的建筑需要时间清理，并影响附近的幸福度。你可以支付一小笔费用立即夷平崩溃的建筑物。'
            },
                [MAIN.下拉框.值, MAIN.下拉框.标签], {
                'Easy': '简单',
                'Medium': '普通',
                'Hard': '困难',
                'Good Luck': '祝你好运',
            }
            ),
            图像叠加: RE(
                [MAIN.设置.选项], {
                'Image Overlay': '图像叠加'
            },
                [MAIN.设置.标签, MAIN.设置.标题], {
                'Overlay file to use': '覆盖图像文件',//
                'Overlay size': '覆盖大小',//
                'Overlay transparency': '覆盖透明度',//
                'Overlay X-position': '图像X坐标',
                'Overlay Z-position': "图像Y坐标"
            },
                [MAIN.设置.描述], {
                'Select an overlay file to use.': '选择要使用的叠加文件。',//
                'Refreshes the list of available overlay files from the \'Overlays\' directory in the Cities: Skylines II user settings directory.': '刷新来自%LocalAppData%Low/olossal Order/Cities Skylines II中的“Overlays”文件夹中图像列表。',//
                'The size of the overlay image projection, in meters.': '覆盖图像投影的大小，以米为单位。',//
                'This can also be changed in-game using the minus and equals keys.': '这也可以在游戏中使用减号和等号键进行更改。',//
                'Resets the overlay size to the default playable map size': '将覆盖大小重置为默认的可玩地图大小',//
                'The transparency of the image; 0% is fully opaque and 100% is fully transparent (invisible).': '图像的透明度；0％是完全不透明的，而100％是完全透明的（不可见）。',//
                'The X (east-west) coordinate of the center of the overlay image projection, in meters.  This can also be changed in-game using the left and right arrow keys while holding down control (for 1m increments) or shift (for 10m increments).': '覆盖图像投影中心的X坐标（东西方向），以米为单位。这也可以在游戏中使用左右箭头键进行更改，同时按住Control键（以1m为增量）或Shift键（以10m为增量）。',
                'The Z (north-south) coordinate of the center of the overlay image projection, in meters.  This can also be changed in-game using the up and down arrow keys while holding down control (for 1m increments) or shift (for 10m increments).': '覆盖图像投影中心的Z坐标（南北方向），以米为单位。这也可以在游戏中使用上下箭头键进行更改，同时按住Control键（以1m为增量）或Shift键（以10m为增量）',
                'Resets the overlay position to the center of the map.': '将覆盖位置重置为地图中心。'
            },
                [MAIN.下拉框.值, MAIN.下拉框.标签], {
                'None': '无',
            },
                [MAIN.按钮, MAIN.设置.标题], {
                'Refresh file list': '刷新文件列表',//
                'Reset overlay size': '重置覆盖大小',//
                'Reset overlay position': "重置覆盖位置"
            }
            ),
            无碰撞: RE(
                [MAIN.工具框.标签], {
                'Anarchy': '无碰撞'
            },
                [MAIN.设置.选项], {
                'Anarchy': '无碰撞'
            },
                [MAIN.设置.标签, MAIN.设置.标题], {
                'Always enable Anarchy with Bulldoze Tool': '始终启用推土机无碰撞',
                'Show Tooltip': '显示工具提示框',
                'Flaming Chirper': '燃烧小鸟',
                'Tool Icon': '工具图标',
                'Reset Anarchy Settings': '重置 无碰撞模组 设置'
            },
                [MAIN.设置.描述], {
                'With this option enabled the Bulldoze Tool will always have anarchy enabled.': '启用此选项后，清障工具将始终启用无碰撞状态。',
                'With this option enabled a tooltip with Ⓐ will be shown when Anarchy is active for appropriate tools.': '启用此选项后，对适当的工具启用无碰撞时将显示带有Ⓐ的工具提示。',
                'With this option enabled the Chirper will be on fire when Anarchy is active for appropriate tools. Image Credit: Bad Peanut.': '微谈小鸟 将着火。 图片来源：Bad Peanut。  ',
                'With this option enabled a icon row with a single button for Anarchy will show up when using appropriate tools.': '启用此选项后，使用适当的工具时将显示一个包含单个无碰撞按  钮的图标显示。',
                'Upon confirmation this will reset the settings for Anarchy mod.': '确认后，这将重置 无碰撞模组 的设置。'
            },
                [MAIN.按钮], {
                'Reset Anarchy Settings': '重置 无碰撞模组 设置'
            }
            ),
            建筑尺寸自定义: RE(
                [HOOKUI.面板.标题, HOOKUI.顶栏.名称], {
                'Zone Spawn Custom': '建筑尺寸自定义'
            },
                [rif().class('content_XD5.content_AD7.child-opacity-transition_nkS.content_BIL').class('toggle_cca.toggle_ATa').next], {
                'Residential': '住宅区',
                'Commercial': '商业区',
                'Industrial': '工业区',
                'Office': '办公区'
            },
                [rif().class('content_XD5.content_AD7.child-opacity-transition_nkS.content_BIL').class('toggle_cca.toggle_ATa').next.next.first], {
                'Detail': '细节'
            },
                [rif().class('content_XD5.content_AD7.child-opacity-transition_nkS.content_BIL').class('info-section_I7V').class('field_vGA')], {
                'Min': '最小',
                'Max': '最大'
            }
            ),
            地图纹理替换: RE(
                [HOOKUI.面板.标题, HOOKUI.顶栏.名称], {
                'Map Texture Replacer': '地图纹理替换'
            },
                [rif({ match: 'inc' }).class('content_XD5.content_AD7.child-opacity-transition_nkS').class('label_DGc.label_ZLb')], {
                'Pack Loaded': '加载的纹理包',
                'None': '无',
                'Grass Diffuse': '草地漫反射',
                'Grass Normal': '草地法线',
                'Dirt Diffuse': '泥土漫反射',
                'Dirt Normal': '泥土法线',
                'Cliff Diffuse': '悬崖漫反射',
                'Cliff Normal': '悬崖法线'
            },
                [MAIN.按钮], {
                'Load Texture Pack': '加载纹理包',
                'Select Image': '选择图像',
                'Reset': '重置'
            }
            ),
            全部区块解锁: RE(
                [MAIN.设置.选项], {
                '529 Tiles': '全部区块解锁'
            },
            ),
            无限刷子尺寸: RE(
                [MAIN.设置.选项], {
                'Brush Size Unlimiter': '无限刷子尺寸'
            },
                [MAIN.设置.标签, MAIN.设置.标题], {
                'Maximum Brush Size': '最大刷子大小',
                'Hide Object Placement Preview With Large Brush Sizes': '巨型刷子下隐藏预览',
            },
                [rif({ match: 'inc', full: true }).class('option-page_CW8.option-section_VzQ').class('info-column_uQ0').class('info-description_wwd')], {
                'Sets the maximum size the brush can be set to in the game/dev UI.':
                    '设置最大刷子大小限制  注意:刷子越大，性能消耗越高',

                'Warning: Disabling this will make large object brushes with high strengths extremely laggy.':
                    '-启用此选项可大幅提高在使用大型对象刷子(≥2500大小)时的性能，通过在悬停时临时将刷子强度设置为0  警告：禁用此选项将使具有高强度的大型对象刷子非常卡顿。  如果存在兼容性问题，请禁用',
            }
            )


        }

        for (const [ObjName, ObjReItems] of Object.entries(REPLACE_ITEM_NEW)) {
            for (const [ReFunc, ReStrs] of ObjReItems) {
                ReFunc.forEach(func => func.REPLACE(ReStrs))
            }
        }
    } catch (err) { addinfo += err }
    let time2 = new Date().getTime()
    if (window.__LOGGING__ && document.getElementsByClassName('fps-display_t30').length) {
        if (!document.getElementById('I18loginfo')) {
            let targetDiv = document.getElementsByClassName('fps-display_t30')[0]
            let infoDiv = document.createElement("div")
            infoDiv.innerHTML = `全局汉化: ${window.__LOGGING__} 段字符 , 耗时 ${time2 - time1} ms ${addinfo}`
            infoDiv.id = 'I18loginfo'
            infoDiv.style.fontFamily = "Noto Sans SC"
            // 在指定<div>的后面插入新的<div>
            targetDiv.appendChild(infoDiv);
        } else {
            document.getElementById('I18loginfo').innerHTML = `全局汉化: ${window.__LOGGING__} 段字符 , 耗时 ${time2 - time1} ms`

        }
    }
}
setInterval(replaceContent, 100);