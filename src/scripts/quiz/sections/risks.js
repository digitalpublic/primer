import Quiz from "../model"
import localforage from "../../common/storage"
import { Model, QuestionListView } from "../view"
import m from "mithril"

localforage.ready().then(function(){
    localforage.getItem('quizRisks').then(function(value) {
     //   console.log(value)
     Model.category="quizRisks"
     if(value===null){
        Model.import(Quiz["risks"])
        m.mount(document.getElementById("exercise"), QuestionListView)
     } else{
       Model.questions = value
       m.mount(document.getElementById("exercise"), QuestionListView)

    }
    }).catch(function(err) {
        console.log(err);
    });
})