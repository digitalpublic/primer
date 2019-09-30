import m from "mithril"
import Quiz from "../quiz/model"
import localforage from "../common/storage"
import lensPath from "ramda/src/lensPath"
import set from "ramda/src/set"
import all from "ramda/src/all"
import includes from "ramda/src/includes"
import __ from "ramda/src/__"
import prop from "ramda/src/prop"
import propOr from "ramda/src/propOr"
import propEq from "ramda/src/propEq"
import compose from "ramda/src/compose"
import filter from "ramda/src/filter"

const Model = {
    questions: [],
    category:"",
    import: (questions)=>{
        console.log(questions)
       questions.map((question)=>{
            let imported = question;
            imported["checked"] = question.checked || false;
            Model.questions.push(imported)
        })
    },
    change: (category, id, result)=>{
        const aLens = lensPath([id-1, "checked"])
        const newQuestions = set(aLens, result, Model.questions)
        Model.questions = newQuestions
        localforage.setItem(Model.category, newQuestions).then(
            function(){
                if(result===false){
                    Model.getDeps(category, id)
                }
            }
        )
    },
    getDeps: (category, id)=>{
        const isDep = includes(id)
        const getDeps = propOr([],"dependencies")
        const filterCond = compose(isDep, getDeps)
        const filtered = filter(filterCond, Model.questions)
        console.log(filtered)
        filtered.map((question)=>{
            Model.change(category, question.id, false)
        })
        m.redraw()
    },

    isDisabled: (deps)=>{
        if(deps === null || deps === undefined || deps === []){return false}
        const inDeps = includes(__, deps)
        const getId = prop("id")
        const isChecked =  all(propEq("checked", true))
        const filterCond = compose(inDeps, getId)

        const filtered = filter(filterCond, Model.questions)
        const result = isChecked(filtered)

        
        return !result
    }
}

const QuestionListView = {
    view: (vnode)=>{
       return m("div",  
       [
           m("h2", {class:"f3 b"}, [m("i", {class:"fas fa-tasks mr3"}),"Test your maturity: check all that apply to your project."]),
       Model.questions.map((question)=>{
            return m(QuestionView, {question: question})
        })]
    )
    }
}

const QuestionView = {
    view: (vnode)=>{
        const idString = `${vnode.attrs.question.category}_${vnode.attrs.question.id}`
        const isDisabled = Model.isDisabled(vnode.attrs.question.dependencies)
        return m("div", {class:"mb3 f4 b lh-copy flex flex-between"}, [
            m("input", {class:"o-0", type: "checkbox", id: idString, checked:vnode.attrs.question.checked, value: idString, disabled: isDisabled, oninput:(e)=>{Model.change(vnode.attrs.question.category, vnode.attrs.question.id, e.target.checked)}},),
          
            m("label", {for:idString, class:`dt pointer pa2 lato navy ${isDisabled ? "o-50" : ""}`}, [  m("span",{class:"mr2"}, [m("i", {class:`dtc v-mid w2 pl0 navy f3 far ${vnode.attrs.question.checked ? "fa-check-square": "fa-square"}`})]), m("span",{class:"dtc v-mid"}, vnode.attrs.question.text)])
        ])
    }
}


export { Model, QuestionListView }