import define1 from "./7764a40fe6b83ca1@427.js";
import define2 from "./e93997d5089d7165@2303.js";
import define3 from "./a33468b95d0b15b0@808.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["shootings@1.json",new URL("./files/f958be12e9c6a0b27b3feecf883b546f37f8815efcea31113505dee3796de70eadfdd7824851ebd2a3a052fb6a82e6f943db0dc2a3fd00c787b430401ec4a32c",import.meta.url)],["stateByRace.json",new URL("./files/2f33df6aaa3da4157ab395c09a7c3cbc37890441d8131e57cf3a4fabe371f5b222b3e27719bb4f2dd2b23becde4439e1a59d7380e814627d4fb40e53510fb6c0",import.meta.url)],["stateOverall.json",new URL("./files/0d456eb159f27c95effcd31dd407b38187192d6e3ce58ae5d411c05ed59ef85f7a266fdc44f01945d8ea8628324f67b188ac94be3f9a5938a9d3d705f58067f8",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Final Project 

By Martin Bernard and Fabricio Rua-Sanchez`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Data`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`


***Source:*** https://www.kaggle.com/ahsen1330/us-police-shootings

The original dataset was obtained from Kaggle. This dataset contain individuals that have been a victim of police shooting in the United States from 2015 to 2020. Each individual is accompanied by various elements, such as their race, age, armed status during the incident, and many more. 

For this final project, we chose to focus five main elements: race, age, armed status, mental health, and gender. The original dataset had more elements than we wanted to focus on and its format was not compatible with what we wanted. We used Python scripts to break up the original dataset into smaller, more manageable datasets, and reformatted them to json files.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## The Task`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`We wanted to analyze the trends of police shootings in the US from the past five year in order to raise awareness while learning more about the marginalized communities, especially with regards to African American and Native American communities, who are disproportionally affected by police shootinngs every year.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# The Visualization`
)});
  main.variable(observer("viewof situation")).define("viewof situation", ["select","situations"], function(select,situations){return(
select({
  title: "Data Represented:",
  options: situations,
  value: ["Race Total"]
})
)});
  main.variable(observer("situation")).define("situation", ["Generators", "viewof situation"], (G, _) => G.input(_));
  main.variable(observer("viewof Selection")).define("viewof Selection", ["radio","getButtonOptions"], function(radio,getButtonOptions){return(
radio  ({
       title: 'Pick Your Scenario',
        description: '',
        options: getButtonOptions(),
        value: 'All'
       })
)});
  main.variable(observer("Selection")).define("Selection", ["Generators", "viewof Selection"], (G, _) => G.input(_));
  main.variable(observer("viewof displayVis")).define("viewof displayVis", ["coordinate","shootings","shootingByRace","victimsUnder25","victims25_35","victims35_45","victims45_50","victimsOver50","armedVictims","unarmedVictims","unknownArmedVictims","situation","getMax","getProp","Selection","totalPerMon","totalPerYear","makeCoordinate","applyCoordinates","getLocalMax","getAllMax","d3"], function(coordinate,shootings,shootingByRace,victimsUnder25,victims25_35,victims35_45,victims45_50,victimsOver50,armedVictims,unarmedVictims,unknownArmedVictims,situation,getMax,getProp,Selection,totalPerMon,totalPerYear,makeCoordinate,applyCoordinates,getLocalMax,getAllMax,d3)
{
  // important stuff
  var colors = {"Asian":"#d37375", "Black":"#9a733c", "White":"#c431a9","Hispanic":"#dd9e31","Native": "#238b45", "Other":"#807dba", 'M': "#43291F", 'F': "#87C38F", "True":"#F4D35E", "False":"#083D77", "10":"#917cdb","11":"#43C59E", "12":"#2D3047", "0":"#247BA0", "1":"#70C1B3","2":"#B2DBBF","3":"#F3FFBD","4":"#FF1654"}// add more keys for gender,age,etc
  
  //getting data
  var asianData = coordinate(shootings, shootingByRace, "Asian");
  var blackData = coordinate(shootings, shootingByRace, "Black");
  var hispanicData = coordinate(shootings, shootingByRace, "Hispanic");
  var nativeData = coordinate(shootings, shootingByRace, "Native");
  var whiteData = coordinate(shootings, shootingByRace, "White");
  var otherData = coordinate(shootings, shootingByRace, "Other")
  var filteredData = [];
  var listOfAges = [victimsUnder25, victims25_35,victims35_45,victims45_50,victimsOver50];
  var listOfArmed = [armedVictims, unarmedVictims, unknownArmedVictims];
  var listOfRace = [{"data" : asianData, "name" : "Asian"},{"data" : blackData, "name" : "Black"},{"data" : hispanicData, "name" : "Hispanic"},{"data" : nativeData, "name" : "Native"},{"data" : whiteData, "name" : "White"},{"data" : otherData, "name" : "Other"}]
  var max;
  var propMax;
  //Determine user input
  if(situation == "Race Total" || situation =="Race Proportionate"){
    if(situation =="Race Proportionate"){
      max = getMax(getProp(asianData, "Asian") , getProp(blackData,"Black"),  getProp(hispanicData, "Hispanic") , getProp(nativeData,"Native"), getProp(whiteData, "White") , getProp(otherData,"Other"))
    }else{
      max = getMax(asianData, blackData, hispanicData, nativeData, whiteData, otherData);
    }
    if(Selection != "All"){
       filteredData = coordinate(shootings, shootingByRace, Selection);
       if(situation == "Race Proportionate"){
          for(let i=0;i<filteredData.length;i++){
            var dProp = (filteredData[i]['count'] / totalPerMon[i]['count']);
            var year = filteredData[i]["date"].slice(0,4);
            for(let j = 0; j<totalPerYear.length;j++){
                if(totalPerYear[j]["year"] == year){
                    var pProp = (totalPerYear[j][Selection]/totalPerYear[j]['Total'])
                    var value =  (dProp/pProp);
                 }
            } 
            filteredData[i]['count'] = value;
          }    
        }
     }
    
  }else if(situation == "age"){
    if(Selection != "All"){
      filteredData = makeCoordinate(listOfAges[Selection])
    }
   
  }else if(situation == "armed"){
    if(Selection != "All"){
      filteredData = makeCoordinate(listOfArmed[Selection])
    }
    
  }else{
    if(Selection != "All"){
      filteredData = applyCoordinates(shootings,situation, Selection)
    }
  }
  
  
  //important stuff
  
  if(Selection != "All"){
    max = getLocalMax(filteredData)
  }else if(situation == 'gender'){
    var lst = [];
    lst.push(applyCoordinates(shootings,situation, 'M'));
    lst.push(applyCoordinates(shootings,situation, 'F'));
    max = getAllMax(lst);
         
  }else if(situation == 'illness'){
    var lst = [];
    lst.push(applyCoordinates(shootings,situation, 'True'));
    lst.push(applyCoordinates(shootings,situation, 'False'));
    max = getAllMax(lst); 
  }else if(situation == 'age'){
    var lst = [];
    for(let i=0; i < listOfAges.length;i++){
         lst.push(makeCoordinate(listOfAges[i]));
    }
    max = getAllMax(lst);
  }else if(situation == 'armed'){
    var lst = [];
    for(let i=0; i < listOfArmed.length;i++){
         lst.push(makeCoordinate(listOfArmed[i]));
    }
    max = getAllMax(lst);
  }
 let height = 500,
      width = 1000;
  
  let margin = {
         top: 20, 
         right: 100, 
         bottom: 40, 
         left: 80};
  
  let svg = d3.create('svg').attr('width', width).attr('height', height);
  
  //create the x-axis 
  let x_scale = d3.scaleTime()
                .domain([new Date("2015-01-02"), new Date("2020-05-01")])
                .range([margin.left, width - margin.right])
                .nice();
  let x_axis = d3.axisBottom(x_scale)
  
  //Create the y-axis
  let y_scale = d3.scaleLinear()
      .domain([0, max+(max/10)])
      .range([height - margin.bottom,margin.top]);
  let y_axis = d3.axisLeft(y_scale)
  
  //Making titles and labels 
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height) + ")")
      .style("text-anchor", "middle")
      .text("Year");
   
  //y-axis label
  var y_label = {"Race Total": "Numbers of Incidents", "Race Proportionate": "Rate of Incidents Based on Population Proportion", "age": "Numbers of Incidents", "gender": "Numbers of Incidents", "illness": "Numbers of Incidents", "armed": "Numbers of Incidents"}
   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(y_label[situation]);
  //title
    var title_dict = {"Race Total": "Numbers of Police Shootings From 2015-2020 (By race)", "Race Proportionate": "Rate of Police Shootings From 2015-2020 (By race proportions)", "age": "Numbers of Police Shootings From 2015-2020 (By age)", "gender": "Numbers of Police Shootings From 2015-2020 (By gender)", "illness": "Numbers of Police Shootings From 2015-2020 (By signs of mental illness)", "armed": "Numbers of Police Shootings From 2015-2020 (By armed status)"}
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (margin.top) + ")")
      .style("text-anchor", "middle")
      .text(title_dict[situation]);
  
 
  //call axis to svg 
  svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(y_axis);
    
  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(x_axis.ticks(d3.timeMonth))
    .selectAll(".tick text").remove()
    .call(x_axis.ticks(d3.timeYear));
  
   svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(x_axis.ticks(d3.timeYear));
  
  
//adding lines
  let line = d3.line()
    .x( d => x_scale(new Date(d["date"]))  )
    .y(d => y_scale(d["count"]))
  
  if(Selection =="All" && situation == "Race Total"){
    svg.append('path')
      .datum(asianData)
      .attr('d', line)
      .attr('fill', 'None')
      .attr('stroke',colors["Asian"])
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
  
    svg.append('path')
      .datum(blackData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke',colors["Black"])
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round') 
    
    svg.append('path')
      .datum(whiteData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke',colors["White"])
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
    
    svg.append('path')
      .datum(hispanicData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke',colors["Hispanic"])
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
  
    svg.append('path')
      .datum(nativeData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke',colors["Native"])
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
    
    svg.append('path')
      .datum(otherData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke',colors["Other"])
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
  }else if(Selection =="All" && situation == "Race Proportionate"){
      for(let i=0; i<listOfRace.length;i++){
        svg.append('path')
          .datum(getProp(listOfRace[i].data, listOfRace[i].name))
          .attr('d', line)
          .attr('fill', 'none')
          .attr('stroke',colors[listOfRace[i].name])
          .attr('stroke-width', 4)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
      }
    
  }else if(Selection == "All" && situation == "gender"){
   
    svg.append('path')
      .datum( applyCoordinates(shootings,situation, 'M'))
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke',colors["M"])
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
    
    svg.append('path')
      .datum( applyCoordinates(shootings,situation, 'F'))
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke',colors['F'])
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')

  }else if(Selection == "All" && situation == "illness"){
    svg.append('path')
      .datum(applyCoordinates(shootings,situation, 'True'))
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke',colors["True"])
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
    
    svg.append('path')
      .datum( applyCoordinates(shootings,situation, 'False'))
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke',colors['False'])
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
    
  }else if(Selection == "All" && situation == "age"){
     for(let i=0; i < listOfAges.length;i++){
        svg.append('path')
            .datum( makeCoordinate(listOfAges[i]) )
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke',colors[i])
            .attr('stroke-width', 4)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
     }
   }else if(Selection == "All" && situation == "armed"){
     for(let i=0; i < listOfArmed.length;i++){
        svg.append('path')
            .datum( makeCoordinate(listOfArmed[i]) )
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke',colors[i+10])
            .attr('stroke-width', 4)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
     }  
  }else{
     var temp = Selection 
     if(situation == 'armed'){
       temp = parseInt(temp) + 10;
     }
     svg.append('path')
      .datum(filteredData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', colors[temp])
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
    
  } 
  function mouseover(d){
    
  }
  return svg.node()
 
}
);
  main.variable(observer("displayVis")).define("displayVis", ["Generators", "viewof displayVis"], (G, _) => G.input(_));
  main.variable(observer()).define(["swatches","d3","legendValue","situation"], function(swatches,d3,legendValue,situation){return(
swatches({
  color: d3.scaleOrdinal(legendValue[situation], legendValue.value)
})
)});
  main.variable(observer("viewof makeMap")).define("viewof makeMap", ["d3","width","statePop2015","statePop2017","statePop2018","statePop2019","stateShapeData","Selection","situation","getLocalMax","perState","perCapita","stateCount","filterBy","shootings","stateData","stateDProp","perAge","applyCountPerState","perArmed"], function(d3,width,statePop2015,statePop2017,statePop2018,statePop2019,stateShapeData,Selection,situation,getLocalMax,perState,perCapita,stateCount,filterBy,shootings,stateData,stateDProp,perAge,applyCountPerState,perArmed)
{
  

  const svg = d3.create('svg').attr('width', width).attr('height', 600)
  //creating colors for map
  var asianScale = d3.quantize(d3.interpolateLab('#ffe2e2',  '#ae5257'), 100);
  var blackScale = d3.quantize(d3.interpolateLab('#ffedec',  '#9a733c'), 100);
  var otherScale = d3.quantize(d3.interpolateLab('#d0bbe4',  '#3f007d'), 100);
  var nativeScale = d3.quantize(d3.interpolateLab('#d1ecc6',  '#00441b'), 100);
  var whiteScale = d3.quantize(d3.interpolateLab('#ffecff',  '#c431a9'), 100);
  var hispanicScale = d3.quantize(d3.interpolateLab('#FAEBD7',  '#eb8f0f'), 100); 
  var allScale =  d3.quantize(d3.interpolateLab('#ffedec',  '#10787a'), 100);
  
  var under25Scale = d3.quantize(d3.interpolateLab('#fffae9',  '#247ba0'), 100);
  var up25down35Scale = d3.quantize(d3.interpolateLab('#ecf5db',  '#258e85'), 100);
  var up35down45Scale = d3.quantize(d3.interpolateLab('#d0efdb',  '#216b44'), 100);
  var up45down50Scale = d3.quantize(d3.interpolateLab('#f3ffbd',  '#840000'), 100);
  var plus50Scale = d3.quantize(d3.interpolateLab('#ffb6bc',  '#b1001f'), 100);
  var allAgeScale = d3.quantize(d3.interpolateLab('#ffedec',  '#10787a'), 100);
  //'#c5a595',  '#43291f'
  var male = d3.quantize(d3.interpolateLab('#ffedec',  '#9a733c'), 100);
  var female = d3.quantize(d3.interpolateLab('#f8f6d5',  '#48905e'), 100);
  
  var yesSign = d3.quantize(d3.interpolateLab('#fff38a',  '#837a00'), 100);
  var noSign = d3.quantize(d3.interpolateLab('#cdecff',  '#083d77'), 100);
  
  var armed = d3.quantize(d3.interpolateLab('#e4f0d7',  '#461d7c'), 100);
  var unarmed = d3.quantize(d3.interpolateLab('#d2fff8',  '#008851'), 100);
  var unknown = d3.quantize(d3.interpolateLab('#d3deaf',  '#2d3047'), 100);
  
  
  
  var colors = {"Asian":asianScale, "Black":blackScale, "White":whiteScale,"Hispanic":hispanicScale,"Native": nativeScale, "Other":otherScale, 'under25': under25Scale, 'to35': up25down35Scale, 'to45': up35down45Scale, 'to50': up45down50Scale, 'over50': plus50Scale, 'allAge': allAgeScale, 'M': male, 'F': female, 'True': yesSign, 'False': noSign, 'armed': armed, 'unarmed': unarmed, 'unknown': unknown, 'all': allScale}
  var listPopulation = [statePop2015, statePop2017,statePop2018,statePop2019,statePop2019];
  
  svg.selectAll('path')
    .data(stateShapeData) // This data, retrieved externally, has points definint the o'utlines of states
    .join('path')
    .attr('d', d3.geoPath()) // geoPath converts the outline points to XY based on a particular type of projection
    .attr('fill', function(d) {
         if(Selection == "All" && (situation == "Race Total" || situation == "Race Proportionate")){
            if(situation == "Race Total"){
             var color = d3.scaleQuantize()
                .domain([0, getLocalMax(perState)])
                .range(allScale)
              return color(perState.find(x => x.full === d.name)['count']);
            }else if(situation == "Race Proportionate"){
               var capita = perCapita(perState);
               var color = d3.scaleQuantize()
                .domain([0, getLocalMax(capita)])
                .range(allScale)
              return color(capita.find(x => x.full === d.name)['count']);
            }
         }else if(situation == "Race Proportionate"){
           var filteredData = stateCount(filterBy(shootings,"race", Selection), stateData);
           var newFilter = stateDProp(filteredData, perState, Selection);
           
         
           var color = d3.scaleQuantize()
                .domain([0, 80])
                .range(colors[Selection])
              return color(filteredData.find(x => x.full === d.name)['proportion']);
         }else if(situation == "Race Total"){
              var filteredData = stateCount(filterBy(shootings,"race", Selection), stateData);
              var color = d3.scaleQuantize()
                .domain([0, getLocalMax(filteredData)])
                .range(colors[Selection])
              return color(filteredData.find(x => x.full === d.name)['count']);
         }else if(situation == 'age'){
               var filteredData = perAge(shootings, stateData)
               if(Selection === '0'){
                 var filteredData = d3.filter(filteredData, x => x.param ==='x<25')
                 var color = d3.scaleQuantize()
                    .domain([0, getLocalMax(filteredData)])
                    .range(colors['under25'])
                 return color(filteredData.find(x => x.full === d.name)['count']);
               }
               else if(Selection === '1'){
                 var filteredData = d3.filter(filteredData, x => x.param ==='25<x<35')
                 var color = d3.scaleQuantize()
                    .domain([0, getLocalMax(filteredData)])
                    .range(colors['to35'])
                 return color(filteredData.find(x => x.full === d.name)['count']);
               }
               else if(Selection === '2'){
                 var filteredData = d3.filter(filteredData, x => x.param ==='35<x<45')
                 var color = d3.scaleQuantize()
                    .domain([0, getLocalMax(filteredData)])
                    .range(colors['to45'])
                 return color(filteredData.find(x => x.full === d.name)['count']);
               }
               else if(Selection === '3'){
                 var filteredData = d3.filter(filteredData, x => x.param ==='45<x<50')
                 var color = d3.scaleQuantize()
                    .domain([0, getLocalMax(filteredData)])
                    .range(colors['to50'])
                 return color(filteredData.find(x => x.full === d.name)['count']);
               }
               else if(Selection === '4'){
                 var filteredData = d3.filter(filteredData, x => x.param ==='x>50')
                 var color = d3.scaleQuantize()
                    .domain([0, getLocalMax(filteredData)])
                    .range(colors['over50'])
                 return color(filteredData.find(x => x.full === d.name)['count']);
               }
               else if(Selection === 'All' ){
                 var filteredData = d3.filter(filteredData, x => x.param ==='all')
                 var color = d3.scaleQuantize()
                    .domain([0, getLocalMax(filteredData)])
                    .range(colors['allAge'])
                 return color(filteredData.find(x => x.full === d.name)['count']);
               }
         }else if(situation == 'gender'){
               if(Selection == 'All'){
                 var maleList = applyCountPerState(shootings, stateData, situation, 'M');
                 var femaleList = applyCountPerState(shootings, stateData, situation, 'F');
                 var temp_list = []
                 for(let i = 0; i < maleList.length; i++){
                   var temp_dict = {}
                   temp_dict['state'] = maleList[i].state
                   temp_dict['full'] = maleList[i].full
                   temp_dict['count'] = maleList[i].count + femaleList[i].count
                   temp_list.push(temp_dict)
                 }
                 
                 var color = d3.scaleQuantize()
                    .domain([0, getLocalMax(temp_list)])
                    .range(colors['all'])
                 return color(temp_list.find(x => x.full === d.name)['count']);
               }
               else{
                 var filteredData = applyCountPerState(shootings, stateData, situation, Selection);
                 var color = d3.scaleQuantize()
                  .domain([0, getLocalMax(filteredData)])
                  .range(colors[Selection])//replace with selection when colors are decided
                 return color(filteredData.find(x => x.full === d.name)['count']);
               }
        }else if(situation == 'illness'){
          if(Selection == 'All'){
            var yesSign = applyCountPerState(shootings, stateData, situation, 'True');
            var noSign = applyCountPerState(shootings, stateData, situation, 'False');
            
            var temp_list = []
            for(let i = 0; i < yesSign.length; i++){
              var temp_dict= {}
              temp_dict['state'] = yesSign[i].state
              temp_dict['full'] = yesSign[i].full
              temp_dict['count'] = yesSign[i].count + noSign[i].count
              temp_list.push(temp_dict)
            }
            var color = d3.scaleQuantize()
              .domain([0, getLocalMax(temp_list)])
              .range(colors["all"])
            return color(temp_list.find(x => x.full === d.name)['count']);
          }else{
            var filteredData = applyCountPerState(shootings, stateData, situation, Selection);
            var color = d3.scaleQuantize()
              .domain([0, getLocalMax(filteredData)])
              .range(colors[Selection])
            return color(filteredData.find(x => x.full === d.name)['count']);
          }
        }else if(situation == 'armed'){
          var filteredData = perArmed(shootings, stateData)
          if(Selection == 'All'){
            var filteredData = d3.filter(filteredData, x => x.param == 'all')
            var color = d3.scaleQuantize()
              .domain([0, getLocalMax(filteredData)])
              .range(colors['all'])
            return color(filteredData.find(x => x.full === d.name)['count']);
          }
          else if(Selection == 0){
            var filteredData = d3.filter(filteredData, x => x.param == 'armed')
            var color = d3.scaleQuantize()
              .domain([0, getLocalMax(filteredData)])
              .range(colors['armed'])
            return color(filteredData.find(x => x.full === d.name)['count']);
          }
          else if(Selection == 1){
            var filteredData = d3.filter(filteredData, x => x.param == 'unarmed')
            var color = d3.scaleQuantize()
              .domain([0, getLocalMax(filteredData)])
              .range(colors['unarmed'])
            return color(filteredData.find(x => x.full === d.name)['count']);
          }
          else if(Selection == 2){
            var filteredData = d3.filter(filteredData, x => x.param == 'unknown')
            var color = d3.scaleQuantize()
              .domain([0, getLocalMax(filteredData)])
              .range(colors['unknown'])
            return color(filteredData.find(x => x.full === d.name)['count']);
          }
        }
    })
    .append('title')
    .text(d => d.name)
    
  
  return svg.node()
}
);
  main.variable(observer("makeMap")).define("makeMap", ["Generators", "viewof makeMap"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`# Visualization Design`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
We wanted the user to be able to interpret the data with two different visualizations, a line chart and a heatmap. The line chart allows them to compare and contrast the trends of police shooting based on race, age, gender, mental health, and threat level. The y-axis is the total number of incidents and the x-axis is the date by month and year. Additionally, the y-axis can be changed to show the number of incidents per capita when comparing and contrasting by race. Each race is represented by a line with a distinct that matches the color of the heat map when it is isolated. The ease of comparison enabled by the line chart allows the users to effortlessly see which groups are most affected by police shootings in the United States
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The heatmap allows the user to visualize the data from a different perspective that is focused more on localizing the incidents as opposed to analyzing trends. It also allows the user to recognize and come to terms with the fact some groups are more disportionately affected in certain areas of the United States. If an element is isolated the map will change to that element's color in order to help the two visuals feel more connected. The heatmap focuses on total count of incidents in the past five years. It was important to us that we include a proportional comparison to show the rate at which certain groups were affected by police shootings because the raw number of incidents can be deceiving since not every race is represented equally in the population.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Reflection`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Through the process of dissecting and visualizing this data we learned a lot about the marginalized groups. For example, we expected the African American community to be the most marginalized group but we discovered that the most proportionally marginalized group was the Native American communities.  We also learned the importance of contextualizing data as this data had two completely different messages when looking at the total number of incidents vs the proportionate equivalent in terms of population. A key insight to this was that although white communities have the highest count of total incidents, other marginalized groups contribute a higher percentage of incidents based on the size of that group’s population. This is the main lesson we want the user to take away from our visualizations.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Each of the other topics also brought valuable information about police shootings as a whole. We learned that men drastically outnumber women when it comes to the number of incidents, a majority of the incidents involve a victon who showed signs of mental illness, and a large majority of incidents occur with people who are armed. Although these insights are not as essential to us as the incidents regarding race, they are still valuable in understanding the context of the data. The heat map also allowed us to contextualize the data in terms of location. We observed that our home state, Virginia, always exhibited high marginalization when looking at incidents proportionally. This helped open our eyes to the fact that these incidents are not as disconnected from our communities as one would like to think and that it is important to participate to support marginalized communities within our  own community.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Helper Functions`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This function retuns a dataset with values in proportion to the amount of the population they are part of `
)});
  main.variable(observer("stateDProp")).define("stateDProp", ["aaPop","asianPop","whitePop","otherPop","nativePop","hispanicPop","statePop2019"], function(aaPop,asianPop,whitePop,otherPop,nativePop,hispanicPop,statePop2019){return(
function stateDProp(racedata, usdata, target){
  
  var listOfOpt = {"Black":aaPop, "Asian": asianPop, "White" : whitePop, "Other": otherPop, "Native" : nativePop, "Hispanic" : hispanicPop };
  var lst = listOfOpt[target]
  var value;
    for(let i = 0; i<racedata.length;i++){
      var incidents = racedata[i].count
      var totInc = usdata[i].count
      
      var dProp = (parseInt(incidents) / parseInt(totInc));
      var population = lst[i]["pop"]["2019"]
      var tPop = statePop2019[i]["pop"]
      
      var pProp = (parseInt(population) / parseInt(tPop));
      
      var value = (dProp/pProp);
      
      racedata[i]["proportion"] = value*10000000
    }
   
  
  return racedata
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This function finds the value of total incidents per state per 100,000 people`
)});
  main.variable(observer("perCapita")).define("perCapita", ["statePop2019"], function(statePop2019){return(
function perCapita(data) {
   const lst = statePop2019;
    var newData = []
    for (let i = 0; i<data.length; i++){//given dataset
        var currentState = {}
        var name = data[i]["full"];
        var curr = data[i]["count"];
        var value;
        for( let j = 0; j<lst.length;j++){ //through population current
                if(lst[j].state == name){
                  
                  var population = lst[j]["pop"];
                  population = population.replaceAll(",", "");
            }
        }
          value = (curr/population)*100000
          currentState["state"]= data[i]["state"];
          currentState["full"]=data[i]["full"];
          currentState["count"] = value
          currentState["pop"] = population;
          newData.push(currentState) 
    }
  
  return (newData);
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This fucntion creates the value for the swatches`
)});
  main.variable(observer("legend")).define("legend", function(){return(
function legend(situation) {
  if(situation == 'Race Total'){
    var legend = {'Race Total': ["African American", "Asian", "Hispanic", "Native Americans", "White", "Others"], 'value': ["#9a733c", "#d37375", "#dd9e31", "#238b45", "#c431a9", "#807dba"]}
  }
  else if(situation == "Race Proportionate"){
    var legend = {'Race Proportionate': ["African American", "Asian", "Hispanic", "Native Americans", "White", "Others"], 'value': ["#9a733c", "#d37375", "#dd9e31", "#238b45", "#c431a9", "#807dba"]}
  }else if(situation == "age"){
    var legend = {'age': ["Under25", "25-35", "35-45", "45-50", "50+"], 'value': ["#247BA0", "#70C1B3", "#B2DBBF", "#F3FFBD", "#FF1654"]}
  }else if(situation == "gender"){
    var legend = {'gender': ["Male", "Female"], 'value': ["#43291F", "#87C38F"]}
  }else if(situation == "illness"){
    var legend = {'illness': ["Signs of mental illness", "No signs of mental illness"], 'value': ["#F4D35E", "#083D77"]}
  }else if(situation == "armed"){
    var legend = {'armed': ["Armed", "Unarmed", "Unknown"], 'value': ["#917cdb", "#43C59E", "#2D3047"]}
  }
   
  return legend
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This fucntion find the proportion between the percentage of populaton made up of a race vs the percentage of incidents they are a part of`
)});
  main.variable(observer("getProp")).define("getProp", ["totalPerMon","totalPerYear"], function(totalPerMon,totalPerYear){return(
function getProp (data,x){
  var newData =[];
       for(let i=0;i<data.length;i++){
         var coord = {};
            var dProp = (data[i]['count'] / totalPerMon[i]['count']);
            var year = data[i]["date"].slice(0,4);
            for(let j = 0; j<totalPerYear.length;j++){
                if(totalPerYear[j]["year"] == year){
                    var pProp = (totalPerYear[j][x]/totalPerYear[j]['Total']);
                    var value =  (dProp/pProp);
                 }
             } 
            coord['count'] = value;
            coord['date'] = data[i].date;
            newData.push(coord);
          } 
  return newData;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`A list of the 6 different scenarios that a user can choose from`
)});
  main.variable(observer("situations")).define("situations", function(){return(
[
    { label: "Total Incidents based on Race", value: 'Race Total' },
    { label: "Incidents proportiante to Race", value: 'Race Proportionate' },
    { label: "Incidents based on Age", value: 'age' },
    { label: "Incidents based on Gender", value: 'gender' },
    { label: "Incidents based on Mental Illness", value: 'illness' },
    { label: "Comaping Armed and Unarmed Incidents", value: 'armed' }
  ]
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This function gets the max of the current filtered list based on user input`
)});
  main.variable(observer("getLocalMax")).define("getLocalMax", function(){return(
function getLocalMax(data){
 var max = 0;
  var i;
 for(i=0;i<data.length;i++){
   if(data[i]["count"] > max){
    max = data[i]["count"];  
   }
 }
  return max;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This function gets the max of the all list in the current situation based on user input`
)});
  main.variable(observer("getAllMax")).define("getAllMax", function(){return(
function getAllMax(lst){
  var max = 0;
  var i;
 for(i=0;i<lst.length;i++){
   for(let j=0; j < lst[i].length;j++){
        if(lst[i][j]["count"] > max){
            max = lst[i][j]["count"];  
          }
   }
 }
  return max;
  
  
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This functionis specifically to get the max between the filtered race lists`
)});
  main.variable(observer("getMax")).define("getMax", ["getLocalMax"], function(getLocalMax){return(
function getMax(a,b,h,n,w,o){
  var max = 0;
  if(getLocalMax(a) > max){
   max = getLocalMax(a); 
  }
  if(getLocalMax(b) > max){
   max = getLocalMax(b); 
  }
  if(getLocalMax(h) > max){
   max = getLocalMax(h); 
  }
  if(getLocalMax(n) > max){
   max = getLocalMax(n); 
  }
  if(getLocalMax(w) > max){
   max = getLocalMax(w); 
  }
  if(getLocalMax(o) > max){
   max = getLocalMax(o); 
  }
  return max;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Create the list of each state.`
)});
  main.variable(observer("getState")).define("getState", function(){return(
function getState(data){
  var stateList = [];
  
  for(let i = 0; i < data.length; i++) {
    var state = data[i]['state'];
    if(!(stateList.includes(state))){
      stateList.push(state);
    }
  }
  
  return stateList.sort(); 
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Create a list of the total incident for each state.`
)});
  main.variable(observer("stateCount")).define("stateCount", ["listOfState"], function(listOfState){return(
function stateCount(data, state_data){
  var countList = []
  
  //create stateCount 
  var stateDict = {}
  for(let i = 0; i < listOfState.length; i++) {
    stateDict[listOfState[i]] = 0
  }
  
  for(let i = 0; i < data.length; i++) {
    stateDict[data[i]['state']] += 1
  }
  for(let i = 0; i < 51; i++) {
    for(let j = 0; j < 51; j++){
      var countDict = {'state': "", 'full': "", 'count': 0}
      var abbreviation = listOfState[i]
      if(state_data[j]['abbreviation'] === abbreviation){
        var full = state_data[j]['name']
        if(full === "District Of Columbia"){
          full = "District of Columbia"
        }
        countDict['state'] = abbreviation
        countDict['full'] = full
        countDict['count'] = stateDict[abbreviation]
        countList.push(countDict)
      }
    }
  }
  
  return countList;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Create a list of total incident for each state for given parameter.`
)});
  main.variable(observer("applyCountPerState")).define("applyCountPerState", ["listOfState"], function(listOfState){return(
function applyCountPerState (data,state_data,sit,sel){
    var countList = []
   
  //create stateCount 
  var stateDict = {}
  for(let i = 0; i < listOfState.length; i++) {
    stateDict[listOfState[i]] = 0
  }
  //get the count
  for(let i = 0; i < data.length; i++) {
     if(data[i][sit] == sel){
       stateDict[data[i]['state']] += 1
       }
  }
  //append values
  for(let i = 0; i < 51; i++) {
    for(let j = 0; j < 51; j++){
      var countDict = {'state': "", 'full': "", 'count': 0}
      var abbreviation = listOfState[i]
      if(state_data[j]['abbreviation'] === abbreviation){
        var full = state_data[j]['name']
        if(full === "District Of Columbia"){
          full = "District of Columbia"
        }
        countDict['state'] = abbreviation
        countDict['full'] = full
        countDict['count'] = stateDict[abbreviation]
        countList.push(countDict)
      }
    }
  }
  
  return countList;
  
  
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This fucntion takes a filtered list and reformats it in order to fit the coordinates of the visual`
)});
  main.variable(observer("coordinate")).define("coordinate", function(){return(
function coordinate(data, count, race){
  const coordDict = []
  const raceCount = count[race];
  
  var xYear = ""
  var xMonth = ""
  var xDate = "01" 
  var xCoord = ""
  
  for(let i = 2015; i < 2021; i++){
   for(let j = 1; j < 13; j++) {
     var coord = []
     xYear = String(i)
     xMonth = String(j)
     xCoord = xYear + "-" + xMonth + "-" + xDate
     var dateDict = {};
        dateDict["date"] = xCoord
       dateDict["count"]= raceCount[i][j]
       coordDict.push(dateDict);
      
    }
  }
    var k;
    for(k=0;k<7;k++){
     coordDict.pop() 
    }
     
  return coordDict;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This fucntion makes a dictionary of each Selection value and connects it with a filtered race list`
)});
  main.variable(observer("filterByRace")).define("filterByRace", ["countPerMonth","d3","shootings"], function(countPerMonth,d3,shootings){return(
function filterByRace(){
var asian = countPerMonth(d3.filter(shootings, d => d['race'] === "Asian"))
var black = countPerMonth(d3.filter(shootings, d => d['race'] === "Black"))
var hispanic = countPerMonth(d3.filter(shootings, d => d['race'] === "Hispanic"))
var white= countPerMonth(d3.filter(shootings, d => d['race'] === "White"))
var native = countPerMonth(d3.filter(shootings, d => d['race'] === "Native"))
var other = countPerMonth(d3.filter(shootings, d => d['race'] === "Other"))
var final_dict = {"Asian": asian, "Black":black, "Hispanic": hispanic,"White": white,
                 "Native": native,"Other": other };
  return final_dict;

}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This fucntion traverses the raw data to give the count per each month`
)});
  main.variable(observer("countPerMonth")).define("countPerMonth", function(){return(
function countPerMonth(data){
    const final_dict = {
                      2015: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0},
                      2016: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0},
                      2017: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0},
                      2018: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0},
                      2019: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0},
                      2020: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0}
                      };
     var i;
     for(i=0;i<data.length;i++){
       final_dict[data[i]['year']][data[i]['month']] += 1
     }
  return final_dict;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This function filters any given data set based on user input`
)});
  main.variable(observer("filterBy")).define("filterBy", function(){return(
function filterBy(data, key, value){
  var filteredDict = [];
  //filter by x
  var i;
  for(i=0;i<data.length;i++){
    if(data[i][key] == value){
      filteredDict.push(data[i]);
    }
  }
  return filteredDict;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md` This fucntion helps to determine which buttons should be shown based on user input`
)});
  main.variable(observer("getButtonOptions")).define("getButtonOptions", ["situation"], function(situation){return(
function getButtonOptions(){
  var optionsList = [];
  if(situation == "Race Proportionate" || situation == "Race Total" ){
       optionsList = [
        { label: 'All', value: 'All' },
        { label: 'White', value: 'White' },
        { label: 'African American', value: 'Black' },
         { label: 'Hispanic', value: 'Hispanic' },
        { label: 'Asian', value: 'Asian' },
        { label: 'Native', value: 'Native' },
        { label: 'Other', value: 'Other' },]
    
  }else if(situation == "age"){
      optionsList = [
        { label: 'All', value: 'All' },
        { label: 'Under 25', value: 0},
        { label: '25-35', value: 1 },
        { label: '35-45', value: 2 },
        { label: '45-50', value: 3},
        { label: '50+', value: 4 },]
    
  }else if(situation == "gender"){
    optionsList = [
        { label: 'All', value: 'All' },
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' },]
    
  }else if(situation == "illness"){
     optionsList = [
        { label: 'All', value: 'All' },
        { label: 'Victim had mental Illness', value: 'True' },
        { label: 'No signs of Illness', value: 'False' },]
    
  }else if(situation == "armed"){
    optionsList = [
        { label: 'All', value: 'All' },
        { label: 'Armed', value: '0' },
        { label: 'UnArmed', value: '1' },
        { label: 'Unknown', value: '2' },]
  }
    
  return optionsList
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md` This fucntion counts parses through dates to find the count per year`
)});
  main.variable(observer("popByYear")).define("popByYear", ["statePopByYear"], function(statePopByYear){return(
function popByYear(year) {
  var out_list = []
  
  for(let i = 0; i < statePopByYear.length; i++) {
    var temp_dict = {}
    
    var state = statePopByYear[i].state;
    var year = year;
    var pop = statePopByYear[i][year];
    
    temp_dict = {'state': state, 'year': year, 'pop': pop}
    out_list.push(temp_dict);
  }
  
  return out_list;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Create a list of the total incident for each age group.`
)});
  main.variable(observer("ageCount")).define("ageCount", ["shootings"], function(shootings){return(
function ageCount(age_extent){
  var out_list = []
  
  for(let i = 0; i < shootings.length; i++) {
    var age = parseInt(shootings[i].age, 10) 
    if(age_extent === "<25") { 
      if(age < 25){
        out_list.push(shootings[i])
      }
    }
    else if(age_extent === "25-35") {
      if(age >= 25 && age <= 35) {
        out_list.push(shootings[i])
      }
    }
    else if(age_extent === "35-45") {
      if(age >= 35 && age <= 45){
        out_list.push(shootings[i])
      }
    }
    else if(age_extent === "45-50") {
      if(age >= 45 && age <= 50){
        out_list.push(shootings[i])
      }
    }
    else {
      if(age > 50){
        out_list.push(shootings[i])
      } 
    }
  }
  
  return out_list;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Create a list of the total incident for each armed status.`
)});
  main.variable(observer("countByArmedStatus")).define("countByArmedStatus", ["shootings"], function(shootings){return(
function countByArmedStatus(status) {
  var return_list = []
  
  for(let i = 0; i < shootings.length; i++){
    var armedStatus = shootings[i].armed

    //status === "unarmed" or "armed" or "unknown"
    if(armedStatus === status){
      return_list.push(shootings[i])
    }
    
    if(status === "armed"){
      if(armedStatus != "unarmed" && armedStatus != "unknown"){
        return_list.push(shootings[i])
      }
    }
    
    
  }
  return return_list;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md` This fucntion takes the given set, filters given user input, and reformats data to be used for coordinates`
)});
  main.variable(observer("applyCoordinates")).define("applyCoordinates", function(){return(
function applyCoordinates(data, situation, selection){
  //takes the data set, filters it based on user input and then counts the monthly incidents for that input
  
  const coordDict = []
  //Template for Date
  var xYear = ""
  var xMonth = ""
  var xDate = "01" 
  var xCoord = ""
  
  for(let i = 2015; i < 2021; i++){
   for(let j = 1; j < 13; j++) {
     var count = 0;
     var coord = []
     xYear = String(i)
     xMonth = String(j)
     xCoord = xYear + "-" + xMonth + "-" + xDate
     if(xMonth.length >1){
       var currentMonth = xCoord.slice(0,7)
       }else if(xMonth.length == 1){
         xMonth = "0" + xMonth;
         var xnewCoord = xYear + "-" + xMonth;
         var currentMonth = xnewCoord
         }
     for(let n = 1; n < data.length; n++) {
         var currentDate = data[n]['date'];
         currentDate = currentDate.slice(0,7);
         if(currentDate == currentMonth && data[n][situation] == [selection]){
           count = count + 1;
         }
     }
     var dateDict = {};
        dateDict["date"] = xCoord
       dateDict["count"]= count
       coordDict.push(dateDict);
   }
  }
    //taking off the last 6 months since data ends on June 2020
    var k;
    for(k=0;k<7;k++){
     coordDict.pop() 
    }
     
  return coordDict;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md` A version of applyCoordinates for pre-filtered data`
)});
  main.variable(observer("makeCoordinate")).define("makeCoordinate", function(){return(
function makeCoordinate(dataset) {
  //Exactly like make Coordinates but the data passed is already filtered and thus only a monthly count is necessary
  
  var coordDict = []
  //Template for Date
  var xYear = ""
  var xMonth = ""
  var xDate = "01"
  var xCoord = ""
  
  for(let i = 2015; i < 2021; i++){
      for(let j = 1; j < 13; j++){
          var count = 0;
          var coord = []
          xYear = String(i)
          xMonth = String(j)
          xCoord = xYear + "-" + xMonth + "-" + xDate
          if(xMonth.length >1){
                var currentMonth = xCoord.slice(0,7)
          }else if(xMonth.length == 1){
                xMonth = "0" + xMonth;
                var xnewCoord = xYear + "-" + xMonth;
                var currentMonth = xnewCoord
          }
          for(let n = 1; n < dataset.length; n++) {
               var currentDate = dataset[n]['date'];
               currentDate = currentDate.slice(0,7);
               if(currentDate == currentMonth){
                        count = count + 1;
               }
          }
          var dateDict = {};
          dateDict["date"] = xCoord
           dateDict["count"]= count
          coordDict.push(dateDict);
      }
  }
   //taking off the last 6 months since data ends on June 2020
   var k;
    for(k=0;k<7;k++){
     coordDict.pop() 
    }
     
  return coordDict;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This function gets the total population per race in the given set`
)});
  main.variable(observer("popTotalByRace")).define("popTotalByRace", function(){return(
function popTotalByRace(stateDataset){
  //[{year:..., black:..., asian:...}..]
  
  var out_list = []
  
  for(let year = 2015; year < 2021; year++){
      var year_pop = {}
      
      var aaTotal = 0
      var aTotal = 0
      var hTotal = 0
      var nTotal = 0
      var wTotal = 0
      var oTotal = 0
      var allTotal = 0
    
      for(let i = 0; i < stateDataset.length; i++){
        if(stateDataset[i].state != "Puerto Rico"){
          var cur_year = year
          if(stateDataset[i]['pop'][year] != "N/A"){
            var yearPop = Number(stateDataset[i]['pop'][year])
           }

          if(stateDataset[i].race === "African American"){
            aaTotal += yearPop
          }else if(stateDataset[i].race === "Asian"){
            aTotal += yearPop
          }else if(stateDataset[i].race === "Hispanic"){
            hTotal += yearPop
          }else if(stateDataset[i].race === "Native"){
            nTotal += yearPop
          }else if(stateDataset[i].race === "White"){
            wTotal += yearPop
          }else if(stateDataset[i].race === "Other"){
            oTotal += yearPop
          }
          
          
        }
       }
    
    allTotal = aaTotal + aTotal + hTotal + nTotal + wTotal + oTotal 
    
    if(year === 2020){
      year_pop = {'year': year, 'Asian': out_list[4].Asian, 'Black': out_list[4].Black, 'Hispanic': out_list[4].Hispanic, 'Native': out_list[4].Native, 'White': out_list[4].White, 'Other': out_list[4].Other, 'Total': out_list[4].Total}
    }
    else{
    year_pop = {'year': year, 'Asian': aTotal, 'Black': aaTotal, 'Hispanic': hTotal, 'Native': nTotal, 'White': wTotal, 'Other': oTotal, 'Total': allTotal}
    }
    out_list.push(year_pop)
  }
  
  
  return out_list
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This function gets the total incidents per month`
)});
  main.variable(observer("totalPerMonth")).define("totalPerMonth", ["coordinate","shootings","shootingByRace"], function(coordinate,shootings,shootingByRace){return(
function totalPerMonth() {  
  var aaIncident = coordinate(shootings, shootingByRace, "Black");
  var aIncident = coordinate(shootings, shootingByRace, "Asian");
  var hIncident = coordinate(shootings, shootingByRace, "Hispanic");
  var nIncident = coordinate(shootings, shootingByRace, "Native");
  var wIncident = coordinate(shootings, shootingByRace, "White");
  var oIncident = coordinate(shootings, shootingByRace, "Other");
  
  var return_list = []
  
  
  for(let i = 0; i < aaIncident.length; i++){
    var totalIncident = 0
    var total_dict = {}
    
    total_dict['date'] = aaIncident[i].date
    total_dict['count'] = aaIncident[i].count + aIncident[i].count + hIncident[i].count + nIncident[i].count + wIncident[i].count + oIncident[i].count
    
    return_list.push(total_dict)
  }
  
  return return_list  
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Function that returns the count of each age group.`
)});
  main.variable(observer("perAge")).define("perAge", function(){return(
function perAge(data, stateData){
  var out_list = []
  var param = ['x<25', '25<x<35', '35<x<45', '45<x<50', 'x>50', 'all']
  
  for(let i = 0; i < stateData.length; i++){
    var temp_dict = {}
    for(let j = 0; j < param.length; j++){
      temp_dict = {}
      temp_dict['state'] = stateData[i].abbreviation
      if(stateData[i].name === "District Of Columbia") {
        temp_dict['full'] = "District of Columbia";
      }
      else{
        temp_dict['full'] = stateData[i].name 
      }
      temp_dict['param'] = param[j]
      temp_dict['count'] = 0
      out_list.push(temp_dict)
    }
  }
  
  for(let i = 0; i < data.length; i++){
    for(let j = 0; j < out_list.length; j++){
      if(data[i].state === out_list[j].state){
        var age = parseInt(data[i].age, 10)
        var option = out_list[j].param
        if(age < 25){
          if(option === 'x<25' || option === 'all') {
            out_list[j].count += 1
          }
        }
        else if(age >= 25 && age < 35){
          if(option === '25<x<35' || option === 'all') {
            out_list[j].count += 1
          }
        }
        else if(age >=35 && age < 45){
          if(option === '35<x<45' || option === 'all') {
            out_list[j].count += 1
          }  
        }
        else if(age >=45 && age <50){
          if(option === '45<x<50' || option === 'all') {
            out_list[j].count += 1
          }
        }
        else if( age >= 50){
          if(option === 'x>50' || option === 'all') {
            out_list[j].count += 1
          }
        }
      }
    }
  }
  
  
  return out_list
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Function that returns the count of each armed status.`
)});
  main.variable(observer("perArmed")).define("perArmed", function(){return(
function perArmed(data, stateData){
  var out_list = []
  var param = ['armed', 'unarmed', 'unknown', 'all']
  
  for(let i = 0; i < stateData.length; i++){
    var temp_dict = {}
    for(let j = 0; j < param.length; j++){
      temp_dict = {}
      temp_dict['state'] = stateData[i].abbreviation
      if(stateData[i].name === "District Of Columbia") {
        temp_dict['full'] = "District of Columbia";
      }
      else{
        temp_dict['full'] = stateData[i].name 
      }
      temp_dict['param'] = param[j]
      temp_dict['count'] = 0
      out_list.push(temp_dict)
    }
  }
  
  for(let i = 0; i < data.length; i++){
    for(let j = 0; j < out_list.length; j++){
      if(data[i].state == out_list[j].state){
        var armedStatus = data[i].armed
        var option = out_list[j].param
        if(armedStatus != 'unarmed' && armedStatus != 'unknown'){
          if(option == 'armed' || option == 'all'){
            out_list[j].count += 1
          }
        }
        else if(armedStatus == 'unarmed'){
          if(option == 'unarmed' || option == 'all'){
           out_list[j].count += 1 
          }
        }
        else if(armedStatus == 'unknown'){
          if(option == 'unknown' || option == 'all'){
            out_list[j].count += 1
          }
        }
      }
    }
  }
  return out_list
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Filtered Data`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The number of incidents per state.`
)});
  main.variable(observer("perState")).define("perState", ["stateCount","shootings","stateData"], function(stateCount,shootings,stateData){return(
stateCount(shootings, stateData)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`List of state abbreviations.`
)});
  main.variable(observer("listOfState")).define("listOfState", ["getState","shootings"], function(getState,shootings){return(
getState(shootings)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Dataset containing the lengend information for each different data representation.`
)});
  main.variable(observer("legendValue")).define("legendValue", ["legend","situation"], function(legend,situation){return(
legend(situation)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The number of indicents by race from 2015 to 2020.`
)});
  main.variable(observer("shootingByRace")).define("shootingByRace", ["filterByRace","shootings"], function(filterByRace,shootings){return(
filterByRace(shootings)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The population of African Americans in each state from 2015 to 2020.`
)});
  main.variable(observer("aaPop")).define("aaPop", ["d3","statePopByRace"], function(d3,statePopByRace){return(
d3.filter(statePopByRace, x => x.race === "African American")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The population of Asians in each state from 2015 to 2020.`
)});
  main.variable(observer("asianPop")).define("asianPop", ["d3","statePopByRace"], function(d3,statePopByRace){return(
d3.filter(statePopByRace, x => x.race === "Asian")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The population of Hispanics in each state from 2015 to 2020.`
)});
  main.variable(observer("hispanicPop")).define("hispanicPop", ["d3","statePopByRace"], function(d3,statePopByRace){return(
d3.filter(statePopByRace, x => x.race === "Hispanic")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The population of Native americans in each state from 2015 to 2020.`
)});
  main.variable(observer("nativePop")).define("nativePop", ["d3","statePopByRace"], function(d3,statePopByRace){return(
d3.filter(statePopByRace, x => x.race === "Native")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The population of white people in each state from 2015 to 2020.`
)});
  main.variable(observer("whitePop")).define("whitePop", ["d3","statePopByRace"], function(d3,statePopByRace){return(
d3.filter(statePopByRace, x => x.race === "White")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The population of other races in each state from 2015 to 2020.`
)});
  main.variable(observer("otherPop")).define("otherPop", ["d3","statePopByRace"], function(d3,statePopByRace){return(
d3.filter(statePopByRace, x => x.race === "Other")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The total population of each state for 2015.`
)});
  main.variable(observer("statePop2015")).define("statePop2015", ["popByYear"], function(popByYear){return(
popByYear(2015)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The total population of each state for 2016.`
)});
  main.variable(observer("statePop2016")).define("statePop2016", ["popByYear"], function(popByYear){return(
popByYear(2016)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The total population of each state for 2017.`
)});
  main.variable(observer("statePop2017")).define("statePop2017", ["popByYear"], function(popByYear){return(
popByYear(2017)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The total population of each state for 2018.`
)});
  main.variable(observer("statePop2018")).define("statePop2018", ["popByYear"], function(popByYear){return(
popByYear(2018)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The total population of each state for 2019.`
)});
  main.variable(observer("statePop2019")).define("statePop2019", ["popByYear"], function(popByYear){return(
popByYear(2019)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`All victims under the age of 25.`
)});
  main.variable(observer("victimsUnder25")).define("victimsUnder25", ["ageCount"], function(ageCount){return(
ageCount("<25")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`All victims between the ages of 25 and 35.`
)});
  main.variable(observer("victims25_35")).define("victims25_35", ["ageCount"], function(ageCount){return(
ageCount("25-35")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`All victims between the ages of 35 and 45.`
)});
  main.variable(observer("victims35_45")).define("victims35_45", ["ageCount"], function(ageCount){return(
ageCount("35-45")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`All victims between the ages of 45 and 50.`
)});
  main.variable(observer("victims45_50")).define("victims45_50", ["ageCount"], function(ageCount){return(
ageCount("45-50")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`All victims over the age of 50.`
)});
  main.variable(observer("victimsOver50")).define("victimsOver50", ["ageCount"], function(ageCount){return(
ageCount("50+")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`All victims who were armed at the time of the incident.`
)});
  main.variable(observer("armedVictims")).define("armedVictims", ["countByArmedStatus"], function(countByArmedStatus){return(
countByArmedStatus("armed")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`All victims who were unarmed at the time of the incident.`
)});
  main.variable(observer("unarmedVictims")).define("unarmedVictims", ["countByArmedStatus"], function(countByArmedStatus){return(
countByArmedStatus("unarmed")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`All victim who's armed status was unknown.`
)});
  main.variable(observer("unknownArmedVictims")).define("unknownArmedVictims", ["countByArmedStatus"], function(countByArmedStatus){return(
countByArmedStatus("unknown")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The total population of each race from 2015 to 2020.`
)});
  main.variable(observer("totalPerYear")).define("totalPerYear", ["popTotalByRace","statePopByRace"], function(popTotalByRace,statePopByRace){return(
popTotalByRace(statePopByRace)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Wrangled down dataset of the number of incidents for each month from 2015 to 2020.`
)});
  main.variable(observer("totalPerMon")).define("totalPerMon", ["totalPerMonth"], function(totalPerMonth){return(
totalPerMonth()
)});
  main.variable(observer()).define(["md"], function(md){return(
md `# Data`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This is the original dataset.`
)});
  main.variable(observer("shootings")).define("shootings", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("shootings@1.json").json()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Number of incident per month from 2015 to 2020`
)});
  main.variable(observer("nationalCounted")).define("nationalCounted", ["countPerMonth","shootings"], function(countPerMonth,shootings){return(
countPerMonth(shootings)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Dataset that includes the name of the states and its abbreviation.`
)});
  main.variable(observer("stateData")).define("stateData", function(){return(
[
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
]
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Dataset of the population of each race in each state from 2015 to 2020.`
)});
  main.variable(observer("statePopByRace")).define("statePopByRace", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("stateByRace.json").json()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Dataset of each state's population from 2015 to 2020.`
)});
  main.variable(observer("statePopByYear")).define("statePopByYear", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("stateOverall.json").json()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Map Data`
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("shapefile")).define("shapefile", ["d3"], function(d3){return(
d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json')
)});
  main.variable(observer("stateShapeData")).define("stateShapeData", ["topojson","shapefile"], function(topojson,shapefile)
{
  let ssd = topojson.feature(shapefile, shapefile.objects.states).features;
  ssd.map(function(stateShapeObject) {
    stateShapeObject.name = stateShapeObject.properties.name; // Make it easier to access the state's name
    return stateShapeObject;
  })
  return ssd;
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`# Appendix`
)});
  const child1 = runtime.module(define1);
  main.import("vl", child1);
  const child2 = runtime.module(define2);
  main.import("slider", child2);
  main.import("color", child2);
  main.import("radio", child2);
  const child3 = runtime.module(define2);
  main.import("button", child3);
  const child4 = runtime.module(define2);
  main.import("select", child4);
  const child5 = runtime.module(define3);
  main.import("swatches", child5);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@v6')
)});
  main.variable(observer()).define(["md"], function(md){return(
md`https://repl.it/@Fabricio1223/finalproject#shootings.json`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`https://replit.com/join/ewzmdhrp-martinbernard2`
)});
  return main;
}
