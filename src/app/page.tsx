"use client"

import { CalendarIcon, ChevronLeft, ChevronRight, Filter, Search, SortAsc, SortDesc } from "lucide-react"
import { useMemo, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { employees } from "@/mocks/employees"
import { ACTIVITY_TYPES, DISPLAY_MODES } from "@/types"

// Get current date info for calculations
const currentDate = new Date()
const currentDay = currentDate.getDate()
const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

export default function CompanyDashboard() {
  const [timeframe, setTimeframe] = useState("month")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.TOTAL)
  const [activeTab, setActiveTab] = useState("all")

  // Filter employees based on search query and selected employee
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSelected = selectedEmployee ? employee.id === selectedEmployee : true
      return matchesSearch && matchesSelected
    })
  }, [searchQuery, selectedEmployee])

  // Sort employees
  const sortedEmployees = useMemo(() => {
    if (!sortField) return filteredEmployees

    return [...filteredEmployees].sort((a, b) => {
      let aValue, bValue

      if (sortField === "name") {
        aValue = a.name
        bValue = b.name
      } else if (sortField === "steps") {
        aValue = a.activities.steps
        bValue = b.activities.steps
      } else if (sortField === "bike") {
        aValue = a.activities.bike
        bValue = b.activities.bike
      } else if (sortField === "active") {
        aValue = a.activities.active
        bValue = b.activities.active
      } else {
        return 0
      }

      if (a.private && !b.private) return 1
      if (!a.private && b.private) return -1
      if (a.private && b.private) return 0

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [filteredEmployees, sortField, sortDirection])

  // Paginate employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedEmployees.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedEmployees, currentPage, itemsPerPage])

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage)

  // Handle sort toggle
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Format activity value based on display mode
  const formatActivityValue = (value: number, activityType: keyof typeof ACTIVITY_TYPES) => {
    const activity = ACTIVITY_TYPES[activityType]
    const required = activity.required

    switch (displayMode) {
      case DISPLAY_MODES.TOTAL:
        const percentage = Math.round((value / required) * 100)
        return `${value.toLocaleString()} / ${required.toLocaleString()} (${percentage}%)`

      case DISPLAY_MODES.AVERAGE_TO_DATE:
        const avgToDate = Math.round(value / currentDay)
        return `${avgToDate.toLocaleString()} ${activity.unit}/day`

      case DISPLAY_MODES.MONTHLY_AVERAGE:
        const monthlyAvg = Math.round(value / daysInMonth)
        return `${monthlyAvg.toLocaleString()} ${activity.unit}/day`

      default:
        return value.toLocaleString()
    }
  }

  // Calculate progress percentage for progress bars
  const calculateProgress = (value: number, activityType: keyof typeof ACTIVITY_TYPES) => {
    const required = ACTIVITY_TYPES[activityType].required
    return Math.min(Math.round((value / required) * 100), 100)
  }

  // Render sort icon
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <SortAsc className="h-4 w-4 text-muted-foreground" />
    return sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <CardTitle>Employee Activity</CardTitle>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Employee</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedEmployee(null)}>All Employees</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {employees.map((employee) => (
                      <DropdownMenuItem key={employee.id} onClick={() => setSelectedEmployee(employee.id)}>
                        {employee.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Display:{" "}
                    {displayMode === DISPLAY_MODES.TOTAL
                      ? "Total"
                      : displayMode === DISPLAY_MODES.AVERAGE_TO_DATE
                        ? "Average to Date"
                        : "Monthly Average"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup value={displayMode} onValueChange={(value) => setDisplayMode(value)}>
                    <DropdownMenuRadioItem value={DISPLAY_MODES.TOTAL}>Total / Required (%)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={DISPLAY_MODES.AVERAGE_TO_DATE}>Average to Date</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={DISPLAY_MODES.MONTHLY_AVERAGE}>Monthly Average</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

                          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {timeframe === "month" ? "Current Month" : "Current Semester"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Time Period</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTimeframe("month")}>Current Month</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeframe("semester")}>Current Semester (Jan-Jun)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeframe("semester2")}>
                  Current Semester (Jul-Dec)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

              <div className="flex items-center space-x-2">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number.parseInt(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Activities</TabsTrigger>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="bike">Bike</TabsTrigger>
                <TabsTrigger value="active">Active Minutes</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm text-muted-foreground">
                    <div className="col-span-4 flex items-center cursor-pointer" onClick={() => toggleSort("name")}>
                      Employee {renderSortIcon("name")}
                    </div>
                    <div className="col-span-2 flex items-center cursor-pointer" onClick={() => toggleSort("steps")}>
                      <span className="mr-1">{ACTIVITY_TYPES.STEPS.icon}</span> Steps {renderSortIcon("steps")}
                    </div>
                    <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort("bike")}>
                      <span className="mr-1">{ACTIVITY_TYPES.BIKE.icon}</span> Bike {renderSortIcon("bike")}
                    </div>
                    <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort("active")}>
                      <span className="mr-1">{ACTIVITY_TYPES.ACTIVE.icon}</span> Active {renderSortIcon("active")}
                    </div>
                  </div>
                  <Separator />
                  {paginatedEmployees.map((employee) => (
                    <div key={employee.id}>
                      <div className="grid grid-cols-12 gap-4 p-4 items-center">
                        <div className="col-span-4 flex items-center space-x-3">
                          <div className="relative">
                            <div
                              className="absolute inset-0 rounded-full"
                              style={{
                                border: `2px solid ${employee.rewardTier.color}`,
                                transform: "scale(1.1)",
                              }}
                            />
                            <Avatar>
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Badge
                                variant="outline"
                                className="mr-2"
                                style={{
                                  borderColor: employee.rewardTier.color,
                                  color: employee.rewardTier.color,
                                }}
                              >
                                {employee.rewardTier.name}
                              </Badge>
                              {employee.private && (
                                <Badge variant="secondary" className="text-xs">
                                  Private
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          {employee.private ? (
                            <span className="text-muted-foreground">Private</span>
                          ) : (
                            <div className="font-medium" style={{ color: ACTIVITY_TYPES.STEPS.color }}>
                              {formatActivityValue(employee.activities.steps, "STEPS")}
                            </div>
                          )}
                        </div>
                        <div className="col-span-3">
                          {employee.private ? (
                            <span className="text-muted-foreground">Private</span>
                          ) : (
                            <div className="font-medium" style={{ color: ACTIVITY_TYPES.BIKE.color }}>
                              {formatActivityValue(employee.activities.bike, "BIKE")}
                            </div>
                          )}
                        </div>
                        <div className="col-span-3">
                          {employee.private ? (
                            <span className="text-muted-foreground">Private</span>
                          ) : (
                            <div className="font-medium" style={{ color: ACTIVITY_TYPES.ACTIVE.color }}>
                              {formatActivityValue(employee.activities.active, "ACTIVE")}
                            </div>
                          )}
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="steps" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 gap-4 p-4 font-medium text-sm text-muted-foreground">
                    <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort("name")}>
                      Employee {renderSortIcon("name")}
                    </div>
                    <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort("steps")}>
                      <span className="mr-1">{ACTIVITY_TYPES.STEPS.icon}</span> Steps {renderSortIcon("steps")}
                    </div>
                  </div>
                  <Separator />
                  {paginatedEmployees.map((employee) => (
                    <div key={employee.id} className="relative">
                      {!employee.private && (
                        <div
                          className="absolute inset-0 h-full bg-opacity-20"
                          style={{
                            width: `${calculateProgress(employee.activities.steps, "STEPS")}%`,
                            backgroundColor: ACTIVITY_TYPES.STEPS.color,
                          }}
                        />
                      )}
                      <div className="relative grid grid-cols-6 gap-4 p-4 items-center z-10">
                        <div className="col-span-3 flex items-center space-x-3">
                          <div className="relative">
                            <div
                              className="absolute inset-0 rounded-full"
                              style={{
                                border: `2px solid ${employee.rewardTier.color}`,
                                transform: "scale(1.1)",
                              }}
                            />
                            <Avatar>
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Badge
                                variant="outline"
                                className="mr-2"
                                style={{
                                  borderColor: employee.rewardTier.color,
                                  color: employee.rewardTier.color,
                                }}
                              >
                                {employee.rewardTier.name}
                              </Badge>
                              {employee.private && (
                                <Badge variant="secondary" className="text-xs">
                                  Private
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3">
                          {employee.private ? (
                            <span className="text-muted-foreground">Private</span>
                          ) : (
                            <div className="font-medium flex items-center justify-between">
                              <span style={{ color: ACTIVITY_TYPES.STEPS.color }}>
                                {formatActivityValue(employee.activities.steps, "STEPS")}
                              </span>
                              <span className="font-bold" style={{ color: ACTIVITY_TYPES.STEPS.color }}>
                                {calculateProgress(employee.activities.steps, "STEPS")}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bike" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 gap-4 p-4 font-medium text-sm text-muted-foreground">
                    <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort("name")}>
                      Employee {renderSortIcon("name")}
                    </div>
                    <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort("bike")}>
                      <span className="mr-1">{ACTIVITY_TYPES.BIKE.icon}</span> Bike {renderSortIcon("bike")}
                    </div>
                  </div>
                  <Separator />
                  {paginatedEmployees.map((employee) => (
                    <div key={employee.id} className="relative">
                      {!employee.private && (
                        <div
                          className="absolute inset-0 h-full bg-opacity-20"
                          style={{
                            width: `${calculateProgress(employee.activities.bike, "BIKE")}%`,
                            backgroundColor: ACTIVITY_TYPES.BIKE.color,
                          }}
                        />
                      )}
                      <div className="relative grid grid-cols-6 gap-4 p-4 items-center z-10">
                        <div className="col-span-3 flex items-center space-x-3">
                          <div className="relative">
                            <div
                              className="absolute inset-0 rounded-full"
                              style={{
                                border: `2px solid ${employee.rewardTier.color}`,
                                transform: "scale(1.1)",
                              }}
                            />
                            <Avatar>
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Badge
                                variant="outline"
                                className="mr-2"
                                style={{
                                  borderColor: employee.rewardTier.color,
                                  color: employee.rewardTier.color,
                                }}
                              >
                                {employee.rewardTier.name}
                              </Badge>
                              {employee.private && (
                                <Badge variant="secondary" className="text-xs">
                                  Private
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3">
                          {employee.private ? (
                            <span className="text-muted-foreground">Private</span>
                          ) : (
                            <div className="font-medium flex items-center justify-between">
                              <span style={{ color: ACTIVITY_TYPES.BIKE.color }}>
                                {formatActivityValue(employee.activities.bike, "BIKE")}
                              </span>
                              <span className="font-bold" style={{ color: ACTIVITY_TYPES.BIKE.color }}>
                                {calculateProgress(employee.activities.bike, "BIKE")}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="active" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 gap-4 p-4 font-medium text-sm text-muted-foreground">
                    <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort("name")}>
                      Employee {renderSortIcon("name")}
                    </div>
                    <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort("active")}>
                      <span className="mr-1">{ACTIVITY_TYPES.ACTIVE.icon}</span> Active {renderSortIcon("active")}
                    </div>
                  </div>
                  <Separator />
                  {paginatedEmployees.map((employee) => (
                    <div key={employee.id} className="relative">
                      {!employee.private && (
                        <div
                          className="absolute inset-0 h-full bg-opacity-20"
                          style={{
                            width: `${calculateProgress(employee.activities.active, "ACTIVE")}%`,
                            backgroundColor: ACTIVITY_TYPES.ACTIVE.color,
                          }}
                        />
                      )}
                      <div className="relative grid grid-cols-6 gap-4 p-4 items-center z-10">
                        <div className="col-span-3 flex items-center space-x-3">
                          <div className="relative">
                            <div
                              className="absolute inset-0 rounded-full"
                              style={{
                                border: `2px solid ${employee.rewardTier.color}`,
                                transform: "scale(1.1)",
                              }}
                            />
                            <Avatar>
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Badge
                                variant="outline"
                                className="mr-2"
                                style={{
                                  borderColor: employee.rewardTier.color,
                                  color: employee.rewardTier.color,
                                }}
                              >
                                {employee.rewardTier.name}
                              </Badge>
                              {employee.private && (
                                <Badge variant="secondary" className="text-xs">
                                  Private
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3">
                          {employee.private ? (
                            <span className="text-muted-foreground">Private</span>
                          ) : (
                            <div className="font-medium flex items-center justify-between">
                              <span style={{ color: ACTIVITY_TYPES.ACTIVE.color }}>
                                {formatActivityValue(employee.activities.active, "ACTIVE")}
                              </span>
                              <span className="font-bold" style={{ color: ACTIVITY_TYPES.ACTIVE.color }}>
                                {calculateProgress(employee.activities.active, "ACTIVE")}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, sortedEmployees.length)} of {sortedEmployees.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Page</span>
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Page</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
