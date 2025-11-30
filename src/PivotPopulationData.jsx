export const PivotPopulationData = (rawApiData) =>{
    const dataByYear = {};
    //カテゴリをループ
    rawApiData.data.forEach(category => {
        const label = category.label;
        //年代をループ
        category.data.forEach(era => {
            const year = era.year;
            const value = era.value;
            if(!dataByYear[year]){
                dataByYear[year] = {year: year}
            }
            dataByYear[year][label] = value;

        })
    })
    return Object.values(dataByYear);
}