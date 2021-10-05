/* global Vue, app, countlyEvent */

(function(countlyVue) {

    var countlyBaseComponent = countlyVue.components.BaseComponent,
        _mixins = countlyVue.mixins;

    Vue.component("cly-back-link", countlyBaseComponent.extend(
        // @vue/component
        {
            mixins: [
                _mixins.i18n
            ],
            props: {
                title: {type: String, required: false},
                link: {type: String, required: false}
            },
            methods: {
                back: function() {
                    if (this.link) {
                        app.navigate(this.link, true);
                    }
                    else {
                        app.back();
                    }
                }
            },
            computed: {
                innerTitle: function() {
                    if (this.title) {
                        return this.title;
                    }
                    return this.i18n("common.back");
                }
            },
            template: '<a @click="back" class="cly-vue-back-link"> \n' +
                            '<span><i class="fas fa-arrow-left bu-pr-3"></i>{{innerTitle}}</span>\n' +
                        '</a>'
        }
    ));

    Vue.component("cly-in-page-notification", countlyBaseComponent.extend(
        {
            props: {
                text: {type: String, required: false}
            },
            computed: {
                innerText: function() {
                    if (this.text) {
                        return this.text;
                    }
                    return "";
                }
            },
            template: '<div class="cly-in-page-notification color-cool-gray-100 bg-red-10 text-medium bu-p-2 center">\
                            <slot><span v-html="innerText"></span></slot>\
                        </div>'
        }
    ));

    Vue.component("cly-empty-home", countlyBaseComponent.extend({
        template: '<div class="cly-vue-empty-home">\n' +
                    '<div class="info">\n' +
                        '<div class="title">{{title}}</div>\n' +
                        '<div class="text">\n' +
                            '{{body}}\n' +
                        '</div>\n' +
                    '</div>\n' +
                    '<div v-if="image">\n' +
                        '<img :src="image">\n' +
                    '</div>\n' +
                '</div>',
        mixins: [countlyVue.mixins.i18n],
        props: {
            title: { required: true, type: String },
            body: { required: true, type: String },
            image: { type: String, default: null }
        }
    }));

    Vue.component("cly-diff-helper", countlyBaseComponent.extend({
        mixins: [
            _mixins.i18n
        ],
        props: {
            diff: {
                type: Array
            },
        },
        computed: {
            hasDiff: function() {
                return this.diff.length > 0;
            },
            madeChanges: function() {
                return this.i18n("common.diff-helper.changes", this.diff.length);
            }
        },
        methods: {
            save: function() {
                this.$emit("save");
            },
            discard: function() {
                this.$emit("discard");
            }
        },
        template: '<div class="cly-vue-diff-helper" v-if="hasDiff">\n' +
                    '<slot name="main">\n' +
                      '<div class="message">\n' +
                          '<span class="text-dark">{{madeChanges}}</span>\n' +
                          '<span class="text-light">{{ i18n("common.diff-helper.keep") }}</span>\n' +
                      '</div>\n' +
                      '<div class="buttons">\n' +
                          '<cly-button :label="i18n(\'common.discard-changes\')" skin="light" class="discard-btn" @click="discard"></cly-button>\n' +
                         '<cly-button :label="i18n(\'common.save-changes\')" skin="green" class="save-btn" @click="save"></cly-button>\n' +
                      '</div>\n' +
                    '</slot>\n' +
                  '</div>'
    }));

    Vue.component("cly-breakdown-tile", countlyBaseComponent.extend({
        mixins: [
            _mixins.i18n
        ],
        props: {
            name: {
                type: String
            },
            type: {
                default: 'multi',
                type: String
            },
            values: {
                type: Array
            }
        },
        template: '<div class="cly-vue-breakdown-tile bu-column bu-is-4">\
                        <div class="cly-vue-breakdown-tile__wrapper bu-p-5">\
                            <h4 class="text-uppercase text-small font-weight-bold">{{name}}</h4>\
                            <div class="cly-vue-breakdown-tile__values-list bu-columns bu-is-gapless bu-is-multiline bu-is-mobile" v-if="type === \'multi\'">\
                                <div v-for="item in values" class="bu-column bu-is-12">\
                                    <div class="cly-vue-breakdown-tile__item">\
                                        <div class="bu-level bu-is-mobile cly-vue-breakdown-tile__item-title">\
                                            <div class="bu-level-left">\
                                                <div class="bu-level-item text-medium">\
                                                    <img v-if="item.icon" :src="item.icon"/>{{item.name}}\
                                                </div>\
                                            </div>\
                                            <div class="bu-level-right">\
                                                <div class="bu-level-item text-medium">\
                                                    <a :href="item.link">{{item.description}} ({{item.percent}}%)</a>\
                                                </div>\
                                            </div>\
                                        </div>\
                                        <div>\
                                            <progress class="bu-progress bu-is-link" :value="item.percent" max="100">{{item.percent}}%</progress>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>'
    }));

    Vue.component("cly-tooltip-icon", countlyBaseComponent.extend({
        props: {
            icon: {
                type: String,
                default: 'ion ion-help-circled'
            },
            tooltip: {
                type: String,
                default: 'Tooltip here :)'
            }
        },
        template: '<i v-bind:class="\'cly-vue-tooltip-icon \' + icon" v-tooltip="tooltip"></i>'
    }));

    Vue.component("cly-remover", countlyBaseComponent.extend({
        props: {
            disabled: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            remove: function() {
                if (!this.disabled) {
                    this.$emit("remove");
                }
            }
        },
        template: '<div class="cly-vue-remover"\n' +
                        'v-if="!disabled"\n' +
                        '@click="remove">\n' +
                        '<slot>\n' +
                            '<i class="el-icon-delete"></i>\n' +
                        '</slot>\n' +
                    '</div>\n'
    }));

    Vue.component("cly-metric-card", countlyBaseComponent.extend({
        mixins: [
            _mixins.commonFormatters
        ],
        props: {
            label: {type: String, default: ''},
            number: {type: Number, default: 0},
            description: {type: String, default: ''},
            formatting: {type: String, default: 'auto'},
            isPercentage: {type: Boolean, default: false},
            columnWidth: {type: [Number, String], default: -1},
            isVertical: {type: Boolean, default: false},
            color: {type: [String, Function, Array], default: ''},
            numberClasses: {type: String, default: 'bu-is-flex bu-is-align-items-baseline'}
        },
        computed: {
            formattedNumber: function() {
                if (this.isNumberSlotUsed) {
                    // Avoid extra processing, it won't be shown anyway.
                    return '';
                }

                if (this.formatting === 'auto') {
                    if (this.isPercentage) {
                        return this.number + " %";
                    }
                    else if (Math.abs(this.number) >= 10000) {
                        return this.getShortNumber(this.number);
                    }
                    else {
                        return this.formatNumber(this.number);
                    }
                }
                else if (this.formatting === 'short') {
                    return this.getShortNumber(this.number);
                }
                else if (this.formatting === 'long') {
                    return this.formatNumber(this.number);
                }

                return this.number;
            },
            isDescriptionSlotUsed: function() {
                return !!this.$slots.description;
            },
            isNumberSlotUsed: function() {
                return !!this.$slots.number;
            },
            topClasses: function() {
                if (this.isVertical || this.columnWidth === -1) {
                    return "";
                }
                return "bu-is-" + this.columnWidth;
            }
        },
        template: '<div class="cly-vue-metric-card bu-column bu-is-flex" :class="topClasses">\
                        <div class="cly-vue-metric-card__wrapper bu-p-5 bu-is-flex bu-is-justify-content-space-between">\
                            <cly-progress-donut class="bu-pr-5 bu-is-flex" v-if="isPercentage" :color="color" :percentage="number"></cly-progress-donut>\
                            <div class="bu-is-flex bu-is-flex-direction-column bu-is-justify-content-space-between">\
                                <span class="text-medium"><slot>{{label}}</slot></span>\
                                <div :class=numberClasses>\
                                    <h2><slot name="number">{{formattedNumber}}</slot></h2>\
                                    <div class="bu-pl-3 bu-is-flex-grow-1"><slot name="description"><span class="text-medium">{{description}}</span></slot></div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>'
    }));

    Vue.component("cly-metric-cards", countlyBaseComponent.extend({
        template: '<div class="cly-vue-metric-cards bu-columns bu-is-gapless bu-is-mobile bu-is-multiline"><slot></slot></div>',
    }));

    var popoverSizes = {
        "small": true,
        "medium": true,
        "auto": true,
        "small-chart": true,
        "medium-chart": true,
        "auto-chart": true
    };

    Vue.component("cly-popover", countlyBaseComponent.extend({
        props: {
            size: {
                type: String,
                default: 'medium',
                validator: function(val) {
                    return val in popoverSizes;
                }
            }
        },
        computed: {
            contentClasses: function() {
                return "cly-vue-popover__content cly-vue-popover__content--" + this.size;
            }
        },
        template: '<v-popover :popoverInnerClass="contentClasses" class="cly-vue-popover"\
                        v-bind="$attrs"\
                        v-on="$listeners">\
                        <slot></slot>\
                        <template v-slot:popover><slot name=\'content\'></slot></template>\
                    </v-popover>',
    }));

    Vue.component("cly-value", countlyBaseComponent.extend({
        template: '<span></span>',
        props: ['value']
    }));

    Vue.component("cly-blank", countlyBaseComponent.extend({
        "template": '<div class="cly-vue-blank bu-is-align-items-center bu-is-flex bu-is-justify-content-center">\
                        <h3 class="color-cool-gray-50">{{text}}</h3>\
                    </div>',
        props: {
            text: {
                type: String,
                default: '',
                required: false
            }
        }
    }));

    Vue.component("cly-event-select", countlyBaseComponent.extend({
        mixins: [countlyVue.mixins.i18n],
        template: '<cly-select-x\
                    pop-class="cly-event-select"\
                    all-placeholder="All Events"\
                    search-placeholder="Search in Events"\
                    placeholder="Select Event"\
                    :hide-default-tabs="true"\
                    :options="availableEvents"\
                    :hide-all-options-tab="true"\
                    :single-option-settings="singleOptionSettings"\
                    :adaptive-length="adaptiveLength"\
                    :arrow="arrow"\
                    :width="width"\
                    v-bind="$attrs"\
                    v-on="$listeners">\
                    <template v-slot:header="selectScope">\
                        <h4 class="color-cool-gray-100 bu-mb-2" v-if="hasTitle">{{title}}</h4>\
                        <el-radio-group\
                            :value="selectScope.activeTabId"\
                            @input="selectScope.updateTab"\
                            size="small">\
                            <el-radio-button v-for="tab in selectScope.tabs" :key="tab.name" :label="tab.name">{{tab.label}}</el-radio-button>\
                        </el-radio-group>\
                    </template>\
                </cly-select-x>',
        props: {
            blacklistedEvents: {
                type: Array,
                default: function() {
                    return [];
                }
            },
            width: { type: [Number, Object], default: 400},
            adaptiveLength: {type: Boolean, default: true},
            arrow: {type: Boolean, default: false},
            title: { type: String, require: false}
        },
        data: function() {
            var self = this;

            var availableEvents = [
                {
                    "label": this.i18n('sidebar.analytics.sessions'),
                    "name": "[CLY]_session",
                    "options": [ { label: this.i18n('sidebar.analytics.sessions'), value: '[CLY]_session' } ]
                },
                {
                    "label": this.i18n('sidebar.events'),
                    "name": "event",
                    "options": countlyEvent.getEvents().map(function(event) {
                        return {label: event.name, value: event.key};
                    })
                },
                {
                    "label": this.i18n('internal-events.[CLY]_view'),
                    "name": "[CLY]_view",
                    "options": [ { label: this.i18n('internal-events.[CLY]_view'), value: '[CLY]_view' } ]
                },
                {
                    "label": this.i18n("sidebar.feedback"),
                    "name": "feedback",
                    "options": [
                        { label: this.i18n('internal-events.[CLY]_star_rating'), value: '[CLY]_star_rating' },
                        { label: this.i18n('internal-events.[CLY]_nps'), value: '[CLY]_nps' },
                        { label: this.i18n('internal-events.[CLY]_survey'), value: '[CLY]_survey' }
                    ]
                },
                {
                    "label": this.i18n('internal-events.[CLY]_crash'),
                    "name": "[CLY]_crash",
                    "options": [ { label: this.i18n('internal-events.[CLY]_crash'), value: '[CLY]_crash' } ]
                }
                // {
                //     "label": this.i18n('internal-events.[CLY]_push_action'),
                //     "name": "[CLY]_push_action",
                //     "noChild": true
                // }
            ];

            availableEvents = availableEvents.filter(function(evt) {
                return !(self.blacklistedEvents.includes(evt.name));
            });

            return {
                singleOptionSettings: {
                    autoPick: true,
                    hideList: true
                },
                availableEvents: availableEvents
            };
        },
        computed: {
            hasTitle: function() {
                return !!this.title;
            }
        }
    }));

    Vue.component("cly-paginate", countlyBaseComponent.extend({
        template: '<div>\
                        <slot v-bind="passedScope"></slot>\
                        <slot name="controls">\
                            <div v-if="hasMultiplePages">\
                                <el-button-group class="bu-ml-2">\
                                    <el-button size="small" :disabled="!prevAvailable" @click="goToPrevPage" icon="el-icon-caret-left"></el-button>\
                                    <el-button size="small" :disabled="!nextAvailable" @click="goToNextPage" icon="el-icon-caret-right"></el-button>\
                                </el-button-group>\
                            </div>\
                        </slot>\
                    </div>',
        watch: {
            lastPage: function() {
                this.checkPageBoundaries();
            },
            value: function(newVal) {
                this.page = newVal;
                this.checkPageBoundaries();
            },
        },
        data: function() {
            return {
                page: 1
            };
        },
        methods: {
            setPage: function(target) {
                this.$emit("input", target);
                this.page = target;
            },
            checkPageBoundaries: function() {
                if (this.lastPage > 0 && this.page > this.lastPage) {
                    this.goToLastPage();
                }
                if (this.page < 1) {
                    this.goToFirstPage();
                }
            },
            goToFirstPage: function() {
                this.setPage(1);
            },
            goToLastPage: function() {
                this.setPage(this.lastPage);
            },
            goToPrevPage: function() {
                if (this.prevAvailable) {
                    this.setPage(this.page - 1);
                }
            },
            goToNextPage: function() {
                if (this.nextAvailable) {
                    this.setPage(this.page + 1);
                }
            },
        },
        computed: {
            currentItems: function() {
                return this.items.slice((this.page - 1) * this.perPage, this.page * this.perPage);
            },
            totalPages: function() {
                return Math.ceil(this.items.length / this.perPage);
            },
            lastPage: function() {
                return this.totalPages;
            },
            hasMultiplePages: function() {
                return this.totalPages > 1;
            },
            prevAvailable: function() {
                return this.page > 1;
            },
            nextAvailable: function() {
                return this.totalPages > this.page;
            },
            passedScope: function() {
                return {
                    page: this.page,
                    currentItems: this.currentItems,
                    totalPages: this.totalPages,
                    prevAvailable: this.prevAvailable,
                    nextAvailable: this.nextAvailable
                };
            }
        },
        props: {
            value: {
                default: 1,
                type: Number,
                validator: function(value) {
                    return value > 0;
                }
            },
            items: {
                type: Array,
                required: true
            },
            perPage: {
                type: Number,
                default: 10
            }
        }
    }));

}(window.countlyVue = window.countlyVue || {}));