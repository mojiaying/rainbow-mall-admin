<template>
  <div class="address-selector">
    <a-form-item-rest>
    <a-flex gap="small">
        <a-select
            :value="province"
            placeholder="请选择省份"
            @change="handleProvinceChange"
            :options="provinceList"
        >
        </a-select>
        <a-select
            :value="city"
            placeholder="请选择城市"
            :disabled="!province"
            @change="handleCityChange"
            :options="cityList"
        >
        </a-select>
        <a-select
            :value="county"
            placeholder="请选择区县"
            :disabled="!city"
            v-if="!TopCity.includes(province)"
            @change="handleDistrictChange"
            :options="countyList"
        >
        </a-select>
    </a-flex>
    </a-form-item-rest>
<!--    <div class="selected-info" v-if="selectedAddress">-->
<!--      <p>当前选择：{{ selectedAddress }}</p>-->
<!--    </div>-->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {getCityApi, getCountyApi, getProvinceApi} from "@/api/common/index";
const props = defineProps(['address'])
const emit = defineEmits(['update:address'])
let TopCity = ['北京市','天津市','上海市','重庆市','香港特别行政区','澳门特别行政区']
console.log('==========props.address===============>>', props.address)
const dataSource = useDataStore()
const provinceList = ref(dataSource.provinceList)
const cityList = ref([])
const countyList = ref([])


// 表单值
const province = ref('');
let provinceCode = ''
const city = ref('');
let cityCode = ''
const county = ref('');
let countyCode = ''

watch(() => props.address, (newValue) => {
  setAddress()
})
function setAddress(){
  if(props.address) {
    province.value = props.address.province
    city.value = props.address.city
    county.value = props.address.county
    provinceCode = props.address.provinceCode
    cityCode = props.address.cityCode
    countyCode = props.address.countyCode
    if(provinceCode) getCityById(provinceCode)
    if(cityCode) getCountyById(cityCode)
  }
}
setAddress()

// 获取省份数据
async function getDeptData(){
  if(!dataSource.provinceList) {
    await dataSource.getProvinceList()
    provinceList.value = dataSource.provinceList
  }
}
getDeptData()

// 获取城市数据
async function getCityById(id) {
  let res = await getCityApi(id)
  cityList.value = res.map((item) => {
    let {id, fullname} = item
    return {value:fullname, label: fullname, id}
  })
}

// 获取区县数据
async function getCountyById(id) {
  let res = await getCountyApi(id)
  countyList.value = res.map((item) => {
    let {id, fullname} = item
    return {value:fullname, label: fullname, id}
  })
  console.log('countyList==============>>', countyList)
}

// 重置方法
function reset() {
  province.value = '';
  city.value = '';
  county.value = '';
  // 触发更新事件，通知父组件数据已重置
  emit('update:address', {province: '', city: '', county: ''});
}


// 当前选中的完整地址
const selectedAddress = computed(() => {
  return {province: province.value, city: city.value, county: county.value,
  provinceCode, cityCode, countyCode}
});

// 事件处理
const handleProvinceChange = (value, option) => {
  console.log('value==============', option);
  province.value = value;
  provinceCode = option.id;
  city.value = '';
  cityCode = ''
  county.value = '';
  countyCode = ''
  getCityById(option.id)
  emit('update:address',selectedAddress.value)
};

const handleCityChange = (value, option) => {
  city.value = value;
  cityCode = option.id;
  county.value = '';
  countyCode = ''
  getCountyById(option.id)
  emit('update:address',selectedAddress.value)
};

const handleDistrictChange = (value, option) => {
  county.value = value;
  countyCode = option.id;
  emit('update:address',selectedAddress.value)
};

// 初始化
onMounted(() => {
  // 可根据需要设置默认值
  // province.value = '440000';
});

// 暴露给父组件
defineExpose({
  reset
});
</script>

<style scoped>
.address-selector {
}

.selected-info {
  margin-top: 16px;
  padding: 8px;
  background-color: #e6f7ff;
  border-radius: 4px;
}
</style>