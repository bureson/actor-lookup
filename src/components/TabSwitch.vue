<template>
  <div class='tabs-container'>
    <ul>
      <li :class='[{"active": tab === this.selectedTab}]' v-for='tab in tabList' :key='tab' @click='() => this.click(tab)'>
        By {{tab}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'TabSwitch',
    props: ['selectedTab', 'click'],
    data() {
      return {
        tabList: ['movie', 'cast']
      };
    }
  }
</script>

<style>
  .tabs-container {
    margin: 0 auto 20px;
    width: 70%;
  }
  .tabs-container ul {
    display: flex;
    justify-content: center;
  }
  .tabs-container ul li {
    width: 50%;
    text-align: center;
    background: #e9ecf1;
    border-right: 1px solid #c1c4c9;
    padding: 13px 15px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .tabs-container ul li:first-child{
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
  }
  .tabs-container ul li:last-child{
    border-right: 0px;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
  }
  .tabs-container ul li:hover,
  .tabs-container ul li.active {
    background: #666;
    color: #fff;
  }
  @media (min-width:600px)  {
    .tabs-container {
      margin: 0 auto 20px;
      width: 30%;
    }
  }
</style>
