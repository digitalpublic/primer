import m from "mithril"
import Chart from 'chart.js'
import length from "ramda/src/length"
import propEq from "ramda/src/propEq"
import filter from "ramda/src/filter"
import localforage from "../common/storage"
import toLower from "ramda/src/toLower"
import values from "ramda/src/values"
import mean from "ramda/src/mean"
import equals from "ramda/src/equals"
import all from "ramda/src/all"
import __ from "ramda/src/__"
import { Advice, Format } from "../quiz/advice"

const Results = {
   count: {
       "assets":0,
       "beneficiaries":0,
       "management":0,
       "permissions":0,
       "purpose":0,
       "risks":0
   },
   order: ["Purpose", "Beneficiaries", "Assets", "Permissions", "Management", "Risks"],
   answers: {},
   chart:{},
   average: ()=>{
        const counts = values(Results.count)
        const output = mean(counts)
        return output
   },
   allEnabled:(category, questions)=>{
        const isChecked = questions.map((question)=>{
            return Results.answers[category][question]["checked"] 
        })

        const isTrue = equals(true)
        return all(isTrue)(isChecked)

        
       
   },
   import: (category, questions)=>{
    const total = length(questions)
    const isChecked =  propEq("checked", true)
    const isTrue = filter(isChecked, questions)

    const totalTrue = length(isTrue)
    const roughLevel = totalTrue / total
    Results.count[category]= Math.max(Math.floor(roughLevel * 5), 1)
    Results.answers[category] = {};
    questions.map((question)=>{
      //  console.log(question)
        Results.answers[category][question.id] = question
    })
    
   }
}





// Overall Maturity Level
const OverallView = {
    view: (vnode)=>{
        return m("div", [
           // m("p", {class:"f2-ns f3"}, `Average maturity level: ${Number.parseFloat(Results.average()).toPrecision(3)}`),
            m(ResultChartView),
            Results.order.map((section)=>{
                return m(SectionView, {category: section})
            })
        ])
    }
}

// Chart
const ResultChartView = {
    oncreate:(vnode)=>{
        const keys = ["Purpose", "Beneficiaries", "Assets", "Permissions", "Management", "Risks"]
        let values =  keys.map((key)=>{
            //values.push(Results.count[key]) 
            return Results.count[toLower(key)]
        })
    
        const data = {
            labels: keys,
            datasets: [{
                data: values,
                backgroundColor: "rgba(0,27, 68, 0.4)",
                pointRadius: 0
            }]
        }

        Results.chart = new Chart(vnode.dom, {
            type: "radar",
            data: data,
            options: {
              tooltips:{
                  enabled: false
              },
             
             
              pointBackgroundColor: "#001b44",
              legend:{
                  display: false,
              },
              scale:{
                  gridLines: {
                      lineWidth:2
                  },
                pointLabels: {
                    fontSize: 20,
                    fontStyle: "bold",
                    fontFamily: "Lato",
                    fontColor: "#001b44"
                },
                ticks:{
                    min:0,
                    max:5,
                    stepSize:1
                }
              }
            }
        })
    },
    view: (vnode)=>{
       return m("canvas", {id:"radarHolder", width: 400, height:400}, [])
    }
}

// Section List
// Section 


const colorByRating = (rating)=>{
    const output = [ "#ff725c",
    "#ff725c",
    "#FDB182",
    "#fbf1a9",
    "#CCEEBC",
    "#9eebcf"
       
    ]

    const normalized = rating != null ? rating : 0
    return output[normalized] 
}

// Section Header Maturity and Color
const SectionHeaderView = {
    view: (vnode)=>{
        return m("p", {class:"f3 b mt5 navy"}, [`${vnode.attrs.category}: `, m("span", {style:`background-color: ${colorByRating(Results.count[toLower(vnode.attrs.category)])}`}, `Level ${Results.count[toLower(vnode.attrs.category)]}`)])

    }
}

// Section Content

const SectionView = {
    view: (vnode)=>{
        return m("div", {class:"mv2"}, [
            m(SectionHeaderView, {category: vnode.attrs.category}),
            m(SectionAdviceView, {category: toLower(vnode.attrs.category)})
        ])
    }
}

// Paragraphs and Spans

const SectionAdviceView = {
    view: (vnode)=>{
        const format = Format[vnode.attrs.category]
        return m("div", {class:"f4 lh-copy"}, format.map((chunk)=>{
           if(Array.isArray(chunk)===true){
            console.log(`${vnode.attrs.category}: ${chunk}`)
          //  console.log(Results.allEnabled(vnode.attrs.category, chunk)) // chase down chunks down below too
                return Results.allEnabled(vnode.attrs.category, chunk) ? null : m(AdviceParagraphView, {category: vnode.attrs.category, questions: chunk})
           } else {
            console.log(`${vnode.attrs.category}: ${chunk}`) // chase down chunks down below too
               //check if paragraph is needed.
               return Results.answers[vnode.attrs.category][chunk]["checked"] === false ? m("p", `${Advice[vnode.attrs.category][chunk]}`) : null
           }
        }))
    }
}

const AdviceParagraphView = {
    view: (vnode)=>{
       return  m("p", vnode.attrs.questions.map((question)=>{
            return m(AdviceSpanView, {qid: question, category: vnode.attrs.category})
        }))
    }
}

const AdviceSpanView = {
    view: (vnode)=>{
        return Results.answers[vnode.attrs.category][vnode.attrs.qid]["checked"] === false ? m("span", `${Advice[vnode.attrs.category][vnode.attrs.qid]} `) : null
    }
}

//Export

//container



localforage.ready().then(function(){
    localforage.getItem('quizAssets').then(function(value) {
        if(value!=null){
            Results.import("assets", value)
        }
        localforage.getItem('quizBeneficiaries').then(function(value) {
            if(value!=null){
                Results.import("beneficiaries", value)
            }
            localforage.getItem('quizManagement').then(function(value) {
                if(value!=null){
                    Results.import("management", value)
                }
                localforage.getItem('quizPurpose').then(function(value) {
                    if(value!=null){
                        Results.import("purpose", value)
                    }
                    localforage.getItem('quizPermissions').then(function(value) {
                        if(value!=null){
                            Results.import("permissions", value)
                        }
                        localforage.getItem('quizRisks').then(function(value) {
                            if(value!=null){
                                Results.import("risks", value)
                                m.mount(document.getElementById("exercise"), OverallView)

                            } else{
                                m.mount(document.getElementById("exercise"), OverallView)

                            }

                        }).catch(function(err) {
                            console.log(err);
                        });
                    }).catch(function(err) {
                        console.log(err);
                    });
                }).catch(function(err) {
                    console.log(err);
                });
            }).catch(function(err) {
                console.log(err);
            });
        }).catch(function(err) {
            console.log(err);
        });
    }).catch(function(err) {
        console.log(err);
    });
    
   
   
 
})