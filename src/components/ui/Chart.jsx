import React, { createContext, useContext, useMemo } from "react";
import { cn } from "./utils";

const THEMES = { light: "", dark: ".dark" };

const ChartContext = createContext(null);

function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

function ChartContainer({ id, className, children, config = {}, ...props }) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn("ui-chart", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        {children}
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }) {
  const colorConfig = Object.entries(config).filter(([, item]) => item?.theme || item?.color);
  if (!colorConfig.length) return null;

  const cssText = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const vars = colorConfig
        .map(([key, itemConfig]) => {
          const color = itemConfig?.theme?.[theme] || itemConfig?.color;
          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join("\n");
      return `${prefix} [data-chart="${id}"] {\n${vars}\n}`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: cssText }} />;
}

function ChartTooltip({ content }) {
  return content ?? null;
}

function getPayloadConfigFromPayload(config, payload, key) {
  if (typeof payload !== "object" || payload === null) return undefined;

  const payloadPayload = payload.payload && typeof payload.payload === "object" ? payload.payload : undefined;
  let configLabelKey = key;

  if (typeof payload[key] === "string") {
    configLabelKey = payload[key];
  } else if (payloadPayload && typeof payloadPayload[key] === "string") {
    configLabelKey = payloadPayload[key];
  }

  return config[configLabelKey] || config[key];
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey
}) {
  const { config } = useChart();

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) return null;
    const item = payload[0];
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value = !labelKey && typeof label === "string"
      ? config[label]?.label || label
      : itemConfig?.label;

    if (labelFormatter) {
      return <div className={cn("ui-chart-tooltip-label", labelClassName)}>{labelFormatter(value, payload)}</div>;
    }
    if (!value) return null;
    return <div className={cn("ui-chart-tooltip-label", labelClassName)}>{value}</div>;
  }, [hideLabel, payload, labelKey, config, label, labelFormatter, labelClassName]);

  if (!active || !payload?.length) return null;
  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div className={cn("ui-chart-tooltip", className)}>
      {!nestLabel ? tooltipLabel : null}
      <div className="ui-chart-tooltip-grid">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item?.payload?.fill || item?.color || "#2563eb";

          return (
            <div key={`${item.dataKey}-${index}`} className={cn("ui-chart-tooltip-row", indicator === "dot" && "ui-chart-tooltip-row-dot")}>
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {!hideIndicator && (
                    <span
                      className={cn(
                        "ui-chart-indicator",
                        indicator === "line" && "ui-chart-indicator-line",
                        indicator === "dashed" && "ui-chart-indicator-dashed"
                      )}
                      style={{ "--chart-color": indicatorColor }}
                    />
                  )}
                  <div className="ui-chart-tooltip-meta">
                    <div className="ui-chart-tooltip-meta-labels">
                      {nestLabel ? tooltipLabel : null}
                      <span className="ui-chart-tooltip-name">{itemConfig?.label || item.name}</span>
                    </div>
                    {item?.value !== undefined && (
                      <span className="ui-chart-tooltip-value">
                        {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartLegend({ content }) {
  return content ?? null;
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey
}) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div className={cn("ui-chart-legend", verticalAlign === "top" ? "ui-chart-legend-top" : "ui-chart-legend-bottom", className)}>
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        return (
          <div key={item.value || key} className="ui-chart-legend-item">
            {!hideIcon && (
              <span
                className="ui-chart-legend-dot"
                style={{ backgroundColor: item.color || "var(--color-primary, #2563eb)" }}
              />
            )}
            <span>{itemConfig?.label || item.value || key}</span>
          </div>
        );
      })}
    </div>
  );
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle
};
