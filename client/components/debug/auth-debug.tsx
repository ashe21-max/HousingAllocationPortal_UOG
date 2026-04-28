"use client";

import { useContext } from "react";
import { AuthContext } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { getMyApplications } from "@/lib/api/applications";
import { ApiError } from "@/lib/api/client";

export function AuthDebug() {
  const authContext = useContext(AuthContext);
  const { session, isReady } = authContext || { session: null, isReady: false };
  
  const {
    data: applications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-applications-debug"],
    queryFn: getMyApplications,
    retry: false,
  });

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Authentication Debug Info</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Auth Session:</h4>
          <pre className="text-xs bg-white p-2 rounded border overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        <div>
          <h4 className="font-medium">Is Ready:</h4>
          <p>{isReady ? "Yes" : "No"}</p>
        </div>
        
        <div>
          <h4 className="font-medium">API Status:</h4>
          <p>Loading: {isLoading ? "Yes" : "No"}</p>
          {error && (
            <div>
              <p className="text-red-600">Error:</p>
              <pre className="text-xs bg-red-50 p-2 rounded border overflow-auto">
                {error instanceof ApiError 
                  ? `Status: ${error.status}, Message: ${error.message}, Code: ${error.code}`
                  : error instanceof Error 
                  ? error.message 
                  : "Unknown error"
                }
              </pre>
            </div>
          )}
          {applications && (
            <div>
              <p className="text-green-600">Success! Found {applications.length} applications</p>
              <pre className="text-xs bg-green-50 p-2 rounded border overflow-auto max-h-40">
                {JSON.stringify(applications, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
