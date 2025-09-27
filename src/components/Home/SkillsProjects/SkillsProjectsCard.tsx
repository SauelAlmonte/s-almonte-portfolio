"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, LabelList } from "recharts";

export type SkillChartDatum = { id: string; value: number; fill: string };
export type SkillsProjectsCardProps = {
    title: string;
    chartData: SkillChartDatum[];
    chartConfig: ChartConfig;
};

const SkillsProjectsCard: React.FC<SkillsProjectsCardProps> = ({title, chartData, chartConfig,}) => (
    <Card
        className="
            rounded-2xl border border-cyan-400/30 bg-white/5 backdrop-blur-md
            shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20
            transition duration-300 hover:border-cyan-300 hover:bg-cyan-300/10 max-w-xl "
    >
        <CardHeader>
            <CardTitle
				className="text-cyan-50 text-sm lg:text-base font-semibold"
			>
				{title}
			</CardTitle>
        </CardHeader>
        <CardContent>
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[300px]"
            >
                <PieChart
					width={320}
					height={320}
				>
                    <ChartTooltip
                        content={<ChartTooltipContent nameKey="value" hideLabel />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="id"
                        cx="50%"
                        cy="50%"
                        outerRadius={125}
                    >
                        {chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                        <LabelList
                            dataKey="id"
                            position="inside"
                            fontSize={12} // Slightly larger
                            formatter={(value: keyof typeof chartConfig) =>
                                chartConfig[value]?.label
                            }
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>
        </CardContent>
    </Card>
);

export default SkillsProjectsCard;
