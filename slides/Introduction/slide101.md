---
layout: default
title: "Program 1: Hello World"
---

<script setup>
const helloCode = `public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`;
</script>

<style>
    .box1 {
        margin-top: -10px; 
        margin-left: -30px; 
        padding-bottom: 10px; 
        width: 107%; 
        max-height: 72vh; 
        color:#464646ff;
        background-color: #ffffffff; 
        font-size: .8rem; 
        font-weight: 400; 
        overflow-x: auto; 
        scrollbar-width: none; 
        overflow-y: auto;
    }

    .box2{
        display: flex; 
        flex-direction:row; 
        justify-content: space-between; 
        align-items:center; 
        gap: 0.75rem; 
        padding:0px 10px; 
        color: #ffffff; 
        margin-bottom: 4px; 
    }

    .box2 > img {
        height: 30px;
    }

    .box3{
        margin: 0; 
        font-size: 1.5rem; 
        font-weight: 700; 
        background-color: #ef5050ff; 
        color: #ffffffff; 
        width: 80%; 
        padding-left:10px; 
        margin-left:-10px
    }

    .box4{
        display: flex; 
        align-items: left; 
        gap: 0.75rem;
        border-radius: 4px; 
        padding:10px; 
        margin-top:10px;
        display: flex;
        flex-direction: column;
    }
    .box5{
        margin: 0; 
        font-size:1rem;

    }
    .box6{
        display: flex;
        flex-direction: row;
        padding: 10px 0px;
    }
    .box7{
        width:100%; 
        padding:0px 10px;
        margin-top: 10px;

        display: flex;
        flex-direction: row;
        gap: 10px;
        justify-content: center;
        align-items: center;
    }
    .box8{
        border: 1px solid #cbd5e1; border-radius: 4px; padding:2px 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 160px;
        height: 100px;
    }
</style>

<div class="box1">
  <div class="box2">
    <h2 class="box3">Introduction</h2>
    <img src="../assets/logo.png"/>
  </div>

  <div class="box4" style="margin-top:80px">
    <h2 v-click class="box5" style="font-size: 2rem; font-weight: 700; letter-spacing: 1px; color:#464646ff">How Java <span style="color: #ef5050ff;">works?</span></h2>
    <p v-click class="box5" style="padding-top: 10px;">Source code is compiled into platform-neutral bytecode, then run by the JVM on any operating system.</p>
  </div>

  <div class="box6" >
    <div class="box7" >
      <div v-click class="box8">
        <div style="font-size: 1rem; font-weight: 700; color:#ef5050ff; margin-top:-1px; height: 15px;">Your code</div>
        <div style="font-size: .7rem; font-weight: 500; color:#464646ff; margin-top:10px;">Main.java</div>
      </div>
      <img v-click src="../assets/arrow.png" style="width: 30px; height: 30px;"/>
      <div v-click class="box8">
        <div style="font-size: 1rem; font-weight: 700; color:#ef5050ff; margin-top:-1px; height: 15px;">javac compiles</div>
        <div style="font-size: .7rem; font-weight: 500; color:#464646ff; margin-top:10px;">Main.class</div>
      </div>
      <img v-click src="../assets/arrow.png" style="width: 30px; height: 30px;"/>
      <div v-click class="box8">
        <div style="font-size: 1rem; font-weight: 700; color:#ef5050ff; margin-top:-1px; height: 15px;">JVM interprets</div>
        <div style="font-size: .7rem; font-weight: 500; color:#464646ff; margin-top:10px;">bytecode</div>
      </div>
      <img v-click src="../assets/arrow.png" style="width: 30px; height: 30px;"/>
      <div v-click class="box8">
        <div style="font-size: 1rem; font-weight: 700; color:#ef5050ff; margin-top:-1px; height: 15px;">Runs on</div>
        <div style="font-size: .7rem; font-weight: 500; color:#464646ff; margin-top:10px;">any Os</div>
      </div>
    </div>
  </div>
</div>
