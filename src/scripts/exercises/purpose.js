import m from "mithril"
import localforage from "../common/storage"
import keys from "ramda/src/keys"
const uuidv4 = require('uuid/v4');


// model

const Model = {
    purpose: "",
    objectives: {},

    updatePurpose: (data)=>{
        Model.purpose = data
        localforage.setItem("purpose", data).then(function (value) {
            // Do other things once the value has been saved.
            console.log(value);
        })
    },
    addObjective: ()=>{
        const content = "";
        const uid = uuidv4()
        Model.objectives[uid] = {content: content, activities: {}}
        localforage.setItem("objectives", Model.objectives)

    },
    updateObjective: (id, content)=>{
        Model.objectives[id].content = content
        localforage.setItem("objectives", Model.objectives)
    },
    removeObjective: (id)=>{
        delete Model.objectives[id]
        localforage.setItem("objectives", Model.objectives)
    },
    addActivity: (objective)=>{
        const content = "";
        const uid = uuidv4()
        Model.objectives[objective].activities[uid] = content  
        localforage.setItem("objectives", Model.objectives) 
    },
    updateActivity: (obj, id, content)=>{
        Model.objectives[obj]["activities"][id] = content
        localforage.setItem("objectives", Model.objectives)
    },
    removeActivity: (obj, id)=>{
        delete Model.objectives[obj].activities[id]
        localforage.setItem("objectives", Model.objectives)
    },
    
}


/*
alternate style
"background-color: rgba(205, 236, 255, 0.5), resize: none"

*/

const purposeView = {
    view: ()=>{
        return m("div", {class:"mb3 mt2"}, [
            m("p",{class:"f3 b navy"}, "Our project's purpose is..."),
            m("textarea", {class:"input-reset bn w-100 br2 f4 pa2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", placeholder:"Write your purpose here", oninput: (e)=>{Model.updatePurpose(e.target.value)}, value:Model.purpose})
        ])
    }
}

const objectiveView = {
    view: (vnode)=>{
        return m("div", {class:"mv4 pv3"}, [
            m('p', {class:"f4 b mt0 navy"}, `Objective ${vnode.attrs.index+1}`, m("i", {class:"fas ml3 f5 fa-trash pointer hover-red", onclick: ()=>{Model.removeObjective(vnode.attrs.id)}}) ),
            m("textarea", {class:"input-reset w-100 bn br2 f5 pa2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", placeholder:"Objective", oninput: (e)=>{Model.updateObjective(vnode.attrs.id, e.target.value)}}, vnode.attrs.objective.content),
            keys(vnode.attrs.objective.activities).map(function(activity, index){
                return m(activityView, {id: activity, content: vnode.attrs.objective.activities[activity], objid: vnode.attrs.id, objindex: vnode.attrs.index, index:index})
            }),
            m("button", {class:"button-reset pointer bg-blue white bn br2 lato b f5 pa2 mv3 ", onclick:()=>{Model.addActivity(vnode.attrs.id)}}, "Add Activity")

        ])
    }
}

const activityView = {
    view: (vnode)=>{
        return m("div",{class:"mv3 pv2"}, [
            m('p', {class:"f5 b mt0 navy"}, `Activity ${vnode.attrs.objindex+1}.${vnode.attrs.index+1}`, m("i", {class:"fas ml3 fa-trash f6 pointer hover-red", onclick: ()=>{Model.removeActivity(vnode.attrs.objid, vnode.attrs.id)}}) ),
            m("input", {class:"input-reset border-box bn w-100 br2 f6 pa2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", oninput: (e)=>{Model.updateActivity(vnode.attrs.objid, vnode.attrs.id, e.target.value)}, value: vnode.attrs.content},)
        ])
    }
}

const MainView = {
    view: ()=>{
        return m("div", [
            m(purposeView),
            m("p",{class:"f3 b mt5 navy"}, "Our project's objectives are..."),
            keys(Model.objectives).map(function(objective, index){
                return m(objectiveView, {id: objective, objective: Model.objectives[objective], index:index})
            }),
            m("button", {class:"button-reset pointer bg-blue white bn br2 lato b f5 pa2", onclick:()=>{Model.addObjective()}}, "Add Objective"),

        ])
    }
}

localforage.ready().then(function(){

    localforage.getItem('purpose').then(function(value) {
        console.log(value)
        Model.purpose = value === null ? "" : value

        localforage.getItem('objectives').then(function(value) {
            Model.objectives = value === null ? {} : value
            console.log(Model.objectives)
            m.mount(document.getElementById("exercise"), MainView)
        }).catch(function(err) {
            // This code runs if there were any errors
            console.log(err);
        });

    }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
    });

    
})
