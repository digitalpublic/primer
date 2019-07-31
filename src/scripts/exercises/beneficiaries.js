import m from "mithril"
import localforage from "../common/storage"
import Sortable from "sortablejs"
import move from "ramda/src/move"
import remove from "ramda/src/remove"
import lensPath from "ramda/src/lensPath"
import set from "ramda/src/set"

const uuidv4 = require('uuid/v4');

const Model = {
    beneficiaries: [],
    stakeholders: {},

    addBeneficiary: ()=>{
        const content = "";
        const uid = uuidv4()
        Model.beneficiaries.push({content: content, id: uid})
        localforage.setItem("beneficiaries", Model.beneficiaries)
    },
    
    updateBeneficiary: (index, content)=>{
        Model.beneficiaries[index].content = content
        localforage.setItem("beneficiaries", Model.beneficiaries)
    },

    resortBeneficiaries: (oldIndex, newIndex)=>{
        const oldOrder = Model.beneficiaries
        const newOrder = move(oldIndex, newIndex, oldOrder)
        Model.beneficiaries = newOrder
        localforage.setItem("beneficiaries", newOrder)
        m.redraw()
    },

    removeBeneficiary: (index)=>{
        const oldSet = Model.beneficiaries
        const newSet = remove(index, 1, oldSet)
        Model.beneficiaries = newSet
        localforage.setItem("beneficiaries", newSet)
    },


    addStakeholder: ()=>{
        const content = "";
        const uid = uuidv4()
        Model.stakeholders[uid] = {content: content, provisions: [], benefits: []}
        localforage.setItem("stakeholders", Model.stakeholders)
    },

    updateStakeholder: (path, value)=>{
        const sLens = lensPath(path)
        const newStake = set(sLens, value, Model.stakeholders)
        Model.stakeholders = newStake
        localforage.setItem("stakeholders", newStake)
    },

    addProvision: (id)=>{
        const content = {provision: "",  id:uuidv4()};
        Model.stakeholders[id].provisions.push(content)
        localforage.setItem("stakeholders", Model.stakeholders)
    },

    removeProvision:(id, index)=>{
        const oldSet = Model.stakeholders[id].provisions
        const newSet = remove(index, 1, oldSet)
        Model.stakeholders[id].provisions = newSet
        localforage.setItem("stakeholders", Model.stakeholders)
    },

    addBenefit: (id)=>{
        const content = {benefit: "", value: "neutral", id:uuidv4()};
        Model.stakeholders[id].benefits.push(content)
        localforage.setItem("stakeholders", Model.stakeholders)
    },

    removeBenefit:(id, index)=>{
        const oldSet = Model.stakeholders[id].benefits
        const newSet = remove(index, 1, oldSet)
        Model.stakeholders[id].benefits = newSet
        localforage.setItem("stakeholders", Model.stakeholders)
    },
}




const beneficiaryListView = {
    oncreate: (vnode)=>{
        var sortable = Sortable.create(vnode.dom, {
            handle: ".handle",
            onEnd: function (/**Event*/evt) {
                var itemEl = evt.item;  // dragged HTMLElement
                Model.resortBeneficiaries(evt.oldDraggableIndex, evt.newDraggableIndex) // element's new index within new parent
            },
        });
    },
    view: (vnode)=>{
        return m("div",[
            vnode.attrs.beneficiaries.map(function(beneficiary, index){
                return m(beneficiaryView, {key: beneficiary.id, content: beneficiary.content, index:index})
            }),
        ])
    }
}

const beneficiaryView = {
    oncreate:(vnode)=>{

    },
    
    view: (vnode)=>{
        return m("div", {class:"pa2 mv2 flex"}, [
            m("div", {class:"mr2 f4 pr2 pv2 lato b navy"}, `${vnode.attrs.index+1}. `),
            m("input", {class:"input-reset border-box bn mw10 br2 f4 pa2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", oninput: (e)=>{Model.updateBeneficiary(vnode.attrs.index, e.target.value)}, value: vnode.attrs.content}),
            m("i", {class:"fas f3 pv2 pl2 navy mh2 handle fa-arrows-alt-v pointer"}),
            m("i", {class:"fas f3 pv2 pl2 navy mh2 handle fa-trash hover-red pointer", onclick:()=>{Model.removeBeneficiary(vnode.attrs.index)}})

        ])
    }
}

const stakeholderListView = {
    view: (vnode)=>{
        return m("div",[
            Object.entries(vnode.attrs.stakeholders).map(function(stakeholder){
                return m(stakeholderView, {key: stakeholder[0], content: stakeholder[1], id: stakeholder[0]})
            }),
        ])
    }
}

const stakeholderView = {
    view: (vnode)=>{

        return m("div", {class:"mb4"}, [
            m("input", {class:"mt2 input-reset border-box bn mw10 br2 f3 pa2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", oninput: (e)=>{Model.updateStakeholder([vnode.attrs.id, "content"], e.target.value)}, value: vnode.attrs.content.content}),
            m("p",{class:"f4 b mt4 navy"}, `What ${vnode.attrs.content.content} provides`),
            m(provisionListView, {stakeholderId: vnode.attrs.id, provisions: vnode.attrs.content.provisions}),
            m("button", {class:"button-reset pointer bg-blue white bn br2 lato b f5 pa2", onclick:()=>{Model.addProvision(vnode.attrs.id)}}, "Add provision"),
            m("p",{class:"f4 b mt4 navy"}, `How ${vnode.attrs.content.content} could benefit`),
            m(benefitListView, {stakeholderId: vnode.attrs.id, benefits: vnode.attrs.content.benefits}),
            m("button", {class:"button-reset pointer bg-blue white bn br2 lato b f5 pa2", onclick:()=>{Model.addBenefit(vnode.attrs.id)}}, "Add benefit"),
            m("hr", {class:"navy mv4"})

        ])
    
    }
}

const provisionListView = {
    view: (vnode)=>{
        return m("div",[
            vnode.attrs.provisions.map(function(provision, index){
                return m(provisionView, {stakeholderId: vnode.attrs.stakeholderId, key: provision.id, index: index, content: provision.provision})
            })
        ])
    }

}
const provisionView = {
    view: (vnode)=>{
        return m("div", {class:"pv2 mv2 flex"}, [
            m("input", {class:"input-reset border-box bn mw10 br2 f4 pa2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", oninput: (e)=>{Model.updateStakeholder([vnode.attrs.stakeholderId, "provisions", vnode.attrs.index, "provision"], e.target.value)}, value: vnode.attrs.content}),
            m("i", {class:"fas f3 pv2 pl2 navy mh2 handle fa-trash hover-red pointer", onclick:()=>{Model.removeProvision(vnode.attrs.stakeholderId, vnode.attrs.index)}})
        ])
    }
}

const benefitListView = {
    view: (vnode)=>{
        return m("div",[
            vnode.attrs.benefits.map(function(benefit, index){
                return m(benefitView, {stakeholderId: vnode.attrs.stakeholderId, key: benefit.id, index: index, benefit: benefit.benefit, value: benefit.value})
            })
        ])
    }
}
const benefitView = {
    view: (vnode)=>{
        return m("div", {class:"pv2 mv2 flex"}, [
            m("input", {class:"input-reset border-box bn mw10 br2 f4 pa2 mr2  lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", oninput: (e)=>{Model.updateStakeholder([vnode.attrs.stakeholderId, "benefits", vnode.attrs.index, "benefit"], e.target.value)}, value: vnode.attrs.benefit}),
            m("select", {class:"input-reset border-box bn mw10 br2 f4 pa2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", onchange: (e)=>{Model.updateStakeholder([vnode.attrs.stakeholderId, "benefits", vnode.attrs.index, "value"], e.target.value)}, value: vnode.attrs.value}, [m("option", {value:"positive"}, "positive"), m("option", {value:"neutral"}, "neutral"), m("option", {value:"negative"}, "negative")]),
            m("i", {class:"fas f3 pv2 pl2 navy mh2 handle fa-trash hover-red pointer", onclick:()=>{Model.removeBenefit(vnode.attrs.stakeholderId, vnode.attrs.index)}})
        ])
    }
    
}

const MainView = {
    view: ()=>{
        return m("div", [
            m("p",{class:"f3 b mt5 navy"}, "Our project's beneficiaries are:"),
            
        
            m(beneficiaryListView, {beneficiaries: Model.beneficiaries}),
            m("button", {class:"button-reset pointer bg-blue white bn br2 lato b f5 pa2", onclick:()=>{Model.addBeneficiary()}}, "Add Beneficiary"),

            m("p", {class:"f3 b mt5 navy"}, "Our project's other stakeholders are:"),
            
            m(stakeholderListView, {stakeholders: Model.stakeholders}),
            m("button", {class:"button-reset pointer bg-blue white bn br2 lato b f5 pa2", onclick:()=>{Model.addStakeholder()}}, "Add Stakeholder"),

        ])
    }
}
localforage.ready().then(function(){

    localforage.getItem('beneficiaries').then(function(value) {
        console.log(value)
        Model.beneficiaries = value === null ? [] : value

        localforage.getItem('stakeholders').then(function(value) {
            console.log(value)

            Model.stakeholders = value === null ? [] : value

      //  localforage.getItem('objectives').then(function(value) {
       //     Model.objectives = value === null ? {} : value
       //     console.log(Model.objectives)
            m.mount(document.getElementById("exercise"), MainView)
        })
      //  }).catch(function(err) {
            // This code runs if there were any errors
        //    console.log(err);
       // });

    }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
    });

    
})
