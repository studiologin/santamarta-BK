"use client"
import React, { memo } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "/brazil-states.json"

// Northeast states + PA
const highlightedStates = ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA', 'PA']

const offices = [
    { name: "Salvador", coordinates: [-38.5108, -12.9714] as [number, number] },
    { name: "Recife", coordinates: [-34.8811, -8.0539] as [number, number] }
]

const BrazilMap = () => {
    return (
        <div className="w-full relative flex items-center justify-center overflow-visible">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 850,
                    center: [-54, -14]
                }}
                className="w-[120%] sm:w-[130%] h-auto min-h-[400px]"
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: any[] }) =>
                        geographies.map((geo: any) => {
                            const sigla = geo.properties.sigla;
                            const isHighlighted = highlightedStates.includes(sigla);
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={isHighlighted ? "#CCA672" : "rgba(255,255,255,0.05)"}
                                    stroke={isHighlighted ? "#FFF" : "rgba(255,255,255,0.1)"}
                                    strokeWidth={isHighlighted ? 0.75 : 0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: isHighlighted ? "#E0C29A" : "rgba(255,255,255,0.1)", outline: "none" },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            )
                        })
                    }
                </Geographies>

                {offices.map(({ name, coordinates }) => (
                    <Marker key={name} coordinates={coordinates}>
                        <circle r={6} fill="#0d2035" stroke="#CCA672" strokeWidth={2} />
                        <text
                            textAnchor="start"
                            x={12}
                            y={5}
                            style={{ fontFamily: "Inter, sans-serif", fill: "#FFF", fontSize: "14px", fontWeight: "bold" }}
                            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        >
                            {name}
                        </text>
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    )
}

export default memo(BrazilMap)
