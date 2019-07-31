import m from "mithril"
import localforage from "../common/storage"
import remove from "ramda/src/remove"
import lensPath from "ramda/src/lensPath"
import set from "ramda/src/set"


const uuidv4 = require('uuid/v4');

const Model = {
    risks: [],
    stakeholders: {},

    addRisk: ()=>{
        const content = {risk: "", likelihood: 1, severity: 1, mitigation: "", owner:"", id: uuidv4()}
        Model.risks.push(content)
        localforage.setItem("risks", Model.risks)

    },

    updateRisk: (path, value)=>{
        const rLens = lensPath(path)
        const newRisks = set(rLens, value, Model.risks)
        Model.risks = newRisks
        localforage.setItem("risks", newRisks)
    },

    removeRisk:(index)=>{
        const oldSet = Model.risks
        const newSet = remove(index, 1, oldSet)
        Model.risks = newSet
        localforage.setItem("risks", newSet)
    },
}

const riskListView = {
    view: (vnode)=>{
        return m("div",[
            vnode.attrs.risks.map(function(risk, index){
                return m(riskView, {risk: risk, index: index})
            }),
            m("button", {class:"button-reset pointer bg-blue white bn br2 lato b f5 pa2", onclick:()=>{Model.addRisk()}}, "Add Risk"),
        ])
    }
}

const riskView = {
    view: (vnode)=>{
        return m("div", {class:"mv4 pv3"}, [
            m("div", {class:"w-100 flex mv2"},[
                m("label", {class:"w-25 mr2 f3 b v-mid pa2"}, "Risk"),
                m("input", {class:"input-reset w-100 bn br2 f3 pa2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", placeholder:"Risk", oninput: (e)=>{Model.updateRisk([vnode.attrs.index, "risk"], e.target.value)}}, vnode.attrs.risk.risk),
            ]),
           
            m("div", {class:"w-100 flex mv2"},[

            m("label", {class:"w-25 mr2 f3 b v-mid pa2"}, "Mitigation"),
            m("input", {class:"input-reset w-100 bn br2 f3 pa2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", placeholder:"Mitigation", oninput: (e)=>{Model.updateRisk([vnode.attrs.index, "mitigation"], e.target.value)}}, vnode.attrs.risk.mitigation),
            ]),

            m("div", {class:"w-100 flex mv2"},[

                m("label", {class:"w-25 mr2 f3 b v-mid pa2"}, "Owner"),
                m("select", {class:"input-reset w-100 bn br2 f3 pa2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", placeholder:"Mitigation", onchange: (e)=>{Model.updateRisk([vnode.attrs.index, "owner"], e.target.value)}, value: vnode.attrs.risk.owner || ""}, 
                  [ Object.entries(Model.stakeholders).map(function(stakeholder){
                        const id = stakeholder[0]
                        const name = stakeholder[1]
                        console.log(id)
                        console.log(name.content)
                        return m("option", {value: id}, name.content)
                    })]
                
                ),
            ]),
    

            m("div", {class:"pv2 mv2 flex w-100"}, [
                m("div",[
                    m("label", {class:"mr2 f4 b v-mid pa2"}, "Likelihood"),
                    m("select", {class:"input-reset border-box bn mw10 br2 f4 pa2 mr3 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", onchange: (e)=>{Model.updateRisk([vnode.attrs.index, "likelihood"], e.target.value)}, value: vnode.attrs.risk.likelihood}, [m("option", {value:1}, "1 (low)"), m("option", {value:2}, "2"), m("option", {value:3}, "3"), m("option", {value:4}, "4"), m("option", {value:5}, "5 (high)")])
                ]),
                m("div",[
                    m("label", {class: "mr2 f4 b v-mid pa2"}, "Severity"),
                    m("select", {class:"input-reset border-box bn mw10 br2 f4 pa2 mr2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", onchange: (e)=>{Model.updateRisk([vnode.attrs.index, "severity"], e.target.value)}, value: vnode.attrs.risk.severity}, [m("option", {value:1}, "1 (low)"), m("option", {value:2}, "2"), m("option", {value:3}, "3"), m("option", {value:4}, "4"), m("option", {value:5}, "5 (high)")]),
    
                ])
               
            ]),
           

         //   m(mitigationListView)

           

        ])
    }
}

const MainView = {
    view: (vnode)=>{
        return m("div", [
            m(riskListView, {risks: Model.risks})
        ])
    }
}



localforage.ready().then(function(){

    localforage.getItem('risks').then(function(value) {
        console.log(value)
        Model.risks = value === null ? [] : value
         localforage.getItem('stakeholders').then(function(value) {
            console.log(value)

            Model.stakeholders = value === null ? {} : value
            m.mount(document.getElementById("exercise"), MainView)
         }).catch(function(err) {
            // This code runs if there were any errors
            console.log(err);
        })

    }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
    });

    
})
